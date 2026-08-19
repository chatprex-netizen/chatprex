import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDb, query } from './db.js';
import crmRouter from './api-crm.js';
import { encrypt, decrypt } from './encryption.js';
import { verifyMetaWebhookSignature } from './webhook-signature.js';
import { sanitizePhoneForMeta, isValidE164, phoneVariants, isRecipientNotAllowedError } from './phone-utils.js';
import {
  sendTextMessage,
  sendMediaMessage,
  sendTemplateMessage,
  verifyPhoneNumber,
  subscribeWabaToApp
} from './meta-api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Raw body parser middleware for webhook signature validation
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message, err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

// Health check
app.get(['/health', '/api/health'], (_req, res) => {
  res.json({ status: 'ok', db: 'postgresql', app: 'CasaYa CRM', timestamp: new Date() });
});

// Mount CRM API Router
app.use(crmRouter);

// ------------------------------------------------------------------
// CONFIGURATION ENDPOINTS
// ------------------------------------------------------------------

// Get masked config
app.get('/api/whatsapp/config', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM whatsapp_config ORDER BY id DESC LIMIT 1');
    const config = rows[0];
    if (!config) {
      return res.json({ configured: false });
    }

    res.json({
      configured: true,
      phone_number_id: config.phone_number_id,
      waba_id: config.waba_id,
      verify_token: config.verify_token,
      app_id: config.app_id,
      access_token_masked: '••••••••••••••••'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save/Update config
app.post('/api/whatsapp/config', async (req, res) => {
  try {
    const { phone_number_id, waba_id, verify_token, app_id, app_secret, access_token } = req.body;
    if (!phone_number_id || !access_token) {
      return res.status(400).json({ error: 'phone_number_id y access_token son obligatorios' });
    }

    // Verify token with Meta API before saving
    try {
      await verifyPhoneNumber({ phoneNumberId: phone_number_id, accessToken: access_token });
    } catch (err) {
      return res.status(400).json({ error: `No se pudo validar con Meta: ${err.message}` });
    }

    // Encrypt token
    const encryptedToken = encrypt(access_token, ENCRYPTION_KEY);

    // Delete existing config and save new
    await query('DELETE FROM whatsapp_config');
    await query(
      'INSERT INTO whatsapp_config (phone_number_id, waba_id, access_token, verify_token, app_secret, app_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [phone_number_id, waba_id, encryptedToken, verify_token, app_secret, app_id]
    );

    // Optionally subscribe WABA to Webhooks
    if (waba_id) {
      try {
        await subscribeWabaToApp({ wabaId: waba_id, accessToken: access_token });
      } catch (err) {
        console.warn('[Meta] Failed to subscribe WABA:', err.message);
      }
    }

    res.json({ success: true, message: 'Configuración guardada y verificada exitosamente en PostgreSQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test config against Meta without persisting
app.post('/api/whatsapp/config/test', async (req, res) => {
  try {
    const { phone_number_id, access_token } = req.body;
    if (!phone_number_id || !access_token) {
      return res.status(400).json({ error: 'phone_number_id y access_token son obligatorios para probar la conexión' });
    }

    await verifyPhoneNumber({ phoneNumberId: phone_number_id, accessToken: access_token });

    res.json({ success: true, message: 'Conexión verificada correctamente con Meta' });
  } catch (err) {
    res.status(400).json({ error: `No se pudo validar con Meta: ${err.message}` });
  }
});

// ------------------------------------------------------------------
// MESSAGES & CONVERSATIONS ENDPOINTS
// ------------------------------------------------------------------

// Get all conversations
app.get('/api/whatsapp/conversations', async (_req, res) => {
  try {
    const { rows } = await query(`
      SELECT conv.*, c.name, c.phone, c.email 
      FROM conversations conv
      JOIN contacts c ON conv.contact_id = c.id
      ORDER BY conv.updated_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages for conversation
app.get('/api/whatsapp/conversations/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send message
app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { conversation_id, message_type, content_text, media_url, filename, template_name, template_params } = req.body;

    if (!conversation_id || !message_type) {
      return res.status(400).json({ error: 'conversation_id y message_type son requeridos' });
    }

    // 1. Load config
    const { rows: configRows } = await query('SELECT * FROM whatsapp_config ORDER BY id DESC LIMIT 1');
    const config = configRows[0];
    if (!config) {
      return res.status(400).json({ error: 'WhatsApp no está configurado en el servidor' });
    }
    const accessToken = decrypt(config.access_token, ENCRYPTION_KEY);

    // 2. Load conversation & contact
    const { rows: convRows } = await query('SELECT * FROM conversations WHERE id = $1', [conversation_id]);
    const conversation = convRows[0];
    if (!conversation) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }
    const { rows: contactRows } = await query('SELECT * FROM contacts WHERE id = $1', [conversation.contact_id]);
    const contact = contactRows[0];
    if (!contact) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    const sanitizedPhone = sanitizePhoneForMeta(contact.phone);
    if (!isValidE164(sanitizedPhone)) {
      return res.status(400).json({ error: 'Número de teléfono con formato inválido' });
    }

    const attemptSend = async (phone) => {
      if (message_type === 'template') {
        return sendTemplateMessage({
          phoneNumberId: config.phone_number_id,
          accessToken,
          to: phone,
          templateName: template_name,
          params: template_params || []
        });
      } else if (['image', 'video', 'document', 'audio'].includes(message_type)) {
        return sendMediaMessage({
          phoneNumberId: config.phone_number_id,
          accessToken,
          to: phone,
          kind: message_type,
          link: media_url,
          caption: content_text,
          filename
        });
      } else {
        return sendTextMessage({
          phoneNumberId: config.phone_number_id,
          accessToken,
          to: phone,
          text: content_text
        });
      }
    };

    // Retry variants if Meta complains recipient not in allowed sandbox list
    let waMessageId = '';
    let workingPhone = sanitizedPhone;
    const variants = phoneVariants(sanitizedPhone);
    let lastError = null;

    for (const variant of variants) {
      try {
        const result = await attemptSend(variant);
        waMessageId = result.messageId;
        workingPhone = variant;
        lastError = null;
        break;
      } catch (err) {
        if (!isRecipientNotAllowedError(err.message)) {
          throw err;
        }
        lastError = err;
        console.warn(`[Send] Variante ${variant} rechazada por sandbox, probando siguiente...`);
      }
    }

    if (lastError) {
      return res.status(502).json({ error: `Error de Meta: ${lastError.message}` });
    }

    // Auto-update phone if variant worked
    if (workingPhone !== sanitizedPhone) {
      await query('UPDATE contacts SET phone = $1 WHERE id = $2', [workingPhone, contact.id]);
    }

    // Save message to PostgreSQL
    const msgId = `msg-${Date.now()}`;
    await query(`
      INSERT INTO messages (id, conversation_id, sender_type, content_type, content_text, media_url, message_id, status)
      VALUES ($1, $2, 'agent', $3, $4, $5, $6, 'sent')
    `, [msgId, conversation_id, message_type, content_text || null, media_url || null, waMessageId]);

    // Update conversation
    const lastMsgPreview = message_type === 'text' ? content_text : `[${message_type}]`;
    await query(
      'UPDATE conversations SET last_message_text = $1, last_message_at = NOW(), updated_at = NOW() WHERE id = $2',
      [lastMsgPreview, conversation_id]
    );

    res.json({ success: true, messageId: msgId, whatsappMessageId: waMessageId });
  } catch (err) {
    console.error('[Send Error]', err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------------------------------
// NOTIFICATIONS ENDPOINTS
// ------------------------------------------------------------------

app.get('/api/notifications', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
    // Map to camelCase for frontend
    const notifications = rows.map(r => ({
      id: r.id,
      title: r.title,
      message: r.message,
      type: r.type,
      read: r.read,
      time: r.created_at
    }));
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const id = `notif-${Date.now()}`;
    await query(
      'INSERT INTO notifications (id, title, message, type) VALUES ($1, $2, $3, $4)',
      [id, title, message, type || 'info']
    );
    res.json({ id, title, message, type, read: false, time: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    await query('UPDATE notifications SET read = TRUE WHERE id = $1', [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/read-all', async (req, res) => {
  try {
    await query('UPDATE notifications SET read = TRUE');
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------------------------------
// WEBHOOK ENDPOINTS
// ------------------------------------------------------------------

// Verification endpoint (GET)
app.get('/api/whatsapp/webhook', async (req, res) => {
  try {
    const mode = req.query['hub.mode'];
    const challenge = req.query['hub.challenge'];
    const verifyTokenInput = req.query['hub.verify_token'];

    if (mode !== 'subscribe' || !challenge || !verifyTokenInput) {
      return res.status(400).send('Parámetros de verificación faltantes');
    }

    const { rows } = await query('SELECT verify_token FROM whatsapp_config ORDER BY id DESC LIMIT 1');
    const config = rows[0];

    if (config && config.verify_token === verifyTokenInput) {
      console.log('[Webhook] Webhook verificado correctamente');
      return res.send(challenge);
    }

    console.warn('[Webhook] Token de verificación no coincide');
    res.status(403).send('Verificación fallida');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Processing inbound notifications (POST)
app.post('/api/whatsapp/webhook', async (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const rawBody = req.rawBody || JSON.stringify(req.body);

  const { rows: configRows } = await query('SELECT app_secret FROM whatsapp_config ORDER BY id DESC LIMIT 1');
  const config = configRows[0];

  // Verify HMAC signature
  const appSecret = config?.app_secret || process.env.META_APP_SECRET;
  if (appSecret) {
    const verified = verifyMetaWebhookSignature(rawBody, signature, appSecret);
    if (!verified) {
      console.warn('[Webhook] Firma de webhook inválida. Denegado.');
      return res.status(401).send('Firma inválida');
    }
  }

  const payload = req.body;

  if (payload.object !== 'whatsapp_business_account') {
    return res.sendStatus(200);
  }

  try {
    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== 'messages') continue;

        const value = change.value;
        if (!value) continue;

        // Process status updates (sent, delivered, read, failed)
        if (value.statuses) {
          for (const statusUpdate of value.statuses) {
            const { id: wamid, status } = statusUpdate;
            console.log(`[Webhook] Status: ${wamid} -> ${status}`);
            await query('UPDATE messages SET status = $1 WHERE message_id = $2', [status, wamid]);
          }
        }

        // Process inbound messages
        if (value.messages) {
          for (const msg of value.messages) {
            const fromPhone = msg.from;
            const wamid = msg.id;

            // Find or create contact
            const { rows: existingContacts } = await query('SELECT * FROM contacts WHERE phone = $1', [fromPhone]);
            let contact = existingContacts[0];
            let isNewContact = false;

            if (!contact) {
              isNewContact = true;
              const contactId = `cont-${Date.now()}`;
              const contactName = value.contacts?.[0]?.profile?.name || `WhatsApp ${fromPhone}`;
              const now = new Date().toISOString();

              // Find least busy agent for round-robin assignment
              const { rows: agents } = await query('SELECT id FROM agents WHERE active = TRUE AND role IN ($1, $2, $3) ORDER BY active_deals_count ASC LIMIT 1', ['admin', 'agente_senior', 'agente']);
              const assignedAgentId = agents.length > 0 ? agents[0].id : null;

              await query(
                `INSERT INTO contacts (id, name, phone, channel, type, pipeline_stage, status_follow_up, lead_score, currency, created_at, last_contact_date, assigned_agent_id)
                 VALUES ($1, $2, $3, 'whatsapp', 'comprador', 'nuevo_prospecto', 'al_dia', 50, 'USD', $4, $4, $5)`,
                [contactId, contactName, fromPhone, now, assignedAgentId]
              );
              contact = { id: contactId, name: contactName, phone: fromPhone, assigned_agent_id: assignedAgentId };

              // Auto-create a Deal in the pipeline for the new WhatsApp lead
              const dealId = `deal-wa-${Date.now()}`;
              await query(
                `INSERT INTO deals (id, title, lead_id, stage, value, currency, probability, agent_id, priority, notes, created_at)
                 VALUES ($1, $2, $3, 'nuevo_prospecto', 0, 'USD', 10, $6, 'media', $4, $5)`,
                [dealId, `WhatsApp - ${contactName}`, contactId, `Contacto ingresado automáticamente vía WhatsApp`, now, assignedAgentId]
              );

              // Update agent active deals count
              if (assignedAgentId) {
                await query('UPDATE agents SET active_deals_count = active_deals_count + 1 WHERE id = $1', [assignedAgentId]);
              }

              // Create notification
              const notifId = `notif-${Date.now()}`;
              await query(
                `INSERT INTO notifications (id, title, message, type) VALUES ($1, $2, $3, 'success')`,
                [notifId, 'Nuevo Lead de WhatsApp', `${contactName} se comunicó por primera vez y fue asignado.`]
              );

              console.log(`[Webhook] Nuevo contacto CRM creado: ${contactName} (${fromPhone}) + Deal ${dealId}`);
            } else {
              // Existing contact: update last contact date, follow up status, and +5 lead score
              await query(
                `UPDATE contacts 
                 SET last_contact_date = NOW(), status_follow_up = $1, lead_score = COALESCE(lead_score, 0) + 5 
                 WHERE id = $2`, 
                ['al_dia', contact.id]
              );
            }

            // Find or create conversation
            const { rows: existingConvs } = await query('SELECT * FROM conversations WHERE contact_id = $1', [contact.id]);
            let conversation = existingConvs[0];

            if (!conversation) {
              const convId = `conv-${contact.id}`;
              await query(
                'INSERT INTO conversations (id, contact_id, last_message_text, last_message_at) VALUES ($1, $2, $3, NOW())',
                [convId, contact.id, '']
              );
              conversation = { id: convId };
            }

            // Resolve message type & body
            let contentType = 'text';
            let contentText = '';
            let mediaUrl = null;

            if (msg.type === 'text') {
              contentType = 'text';
              contentText = msg.text?.body || '';
            } else if (['image', 'video', 'document', 'audio'].includes(msg.type)) {
              contentType = msg.type;
              contentText = msg[msg.type]?.caption || `[Archivo ${msg.type}]`;
              mediaUrl = msg[msg.type]?.id || null;
            } else if (msg.type === 'interactive') {
              contentType = 'interactive';
              const ir = msg.interactive;
              contentText = ir.button_reply?.title || ir.list_reply?.title || '[Interactiva]';
            } else if (msg.type === 'button') {
              contentType = 'interactive';
              contentText = msg.button?.text || '[Botón]';
            }

            // Insert inbound message
            const localMsgId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
            await query(`
              INSERT INTO messages (id, conversation_id, sender_type, content_type, content_text, media_url, message_id, status)
              VALUES ($1, $2, 'contact', $3, $4, $5, $6, 'read')
            `, [localMsgId, conversation.id, contentType, contentText, mediaUrl, wamid]);

            // Update conversation last message
            await query(
              'UPDATE conversations SET last_message_text = $1, last_message_at = NOW(), updated_at = NOW() WHERE id = $2',
              [contentText, conversation.id]
            );

            console.log(`[Webhook] Mensaje entrante guardado. De: ${contact.name} (${fromPhone}) -> ${contentText}${isNewContact ? ' [NUEVO LEAD]' : ''}`);
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('[Webhook Processing Error]', err);
    res.status(500).send(err.message);
  }
});

// ------------------------------------------------------------------
// AI KNOWLEDGE BASE (pgvector) ENDPOINTS
// ------------------------------------------------------------------

// Insert knowledge entry (with optional embedding)
app.post('/api/ai/knowledge', async (req, res) => {
  try {
    const { title, content, metadata, embedding } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'El campo content es obligatorio' });
    }

    if (embedding && Array.isArray(embedding)) {
      // With vector embedding
      const embeddingStr = `[${embedding.join(',')}]`;
      await query(
        'INSERT INTO ai_knowledge_embeddings (title, content, metadata, embedding) VALUES ($1, $2, $3, $4)',
        [title || null, content, metadata ? JSON.stringify(metadata) : null, embeddingStr]
      );
    } else {
      // Without embedding (text-only)
      await query(
        'INSERT INTO ai_knowledge_embeddings (title, content, metadata) VALUES ($1, $2, $3)',
        [title || null, content, metadata ? JSON.stringify(metadata) : null]
      );
    }

    res.json({ success: true, message: 'Conocimiento almacenado en PostgreSQL con pgvector' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Semantic search using pgvector cosine similarity
app.post('/api/ai/knowledge/search', async (req, res) => {
  try {
    const { embedding, limit = 5 } = req.body;
    if (!embedding || !Array.isArray(embedding)) {
      return res.status(400).json({ error: 'Se requiere un vector embedding para la búsqueda semántica' });
    }

    const embeddingStr = `[${embedding.join(',')}]`;
    const { rows } = await query(`
      SELECT id, title, content, metadata,
             1 - (embedding <=> $1::vector) AS similarity
      FROM ai_knowledge_embeddings
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT $2
    `, [embeddingStr, limit]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Full-text search fallback (no embeddings required)
app.get('/api/ai/knowledge/search-text', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) {
      return res.status(400).json({ error: 'Se requiere un parámetro ?q= para buscar' });
    }

    const { rows } = await query(`
      SELECT id, title, content, metadata,
             ts_rank(to_tsvector('spanish', coalesce(title, '') || ' ' || content), plainto_tsquery('spanish', $1)) AS rank
      FROM ai_knowledge_embeddings
      WHERE to_tsvector('spanish', coalesce(title, '') || ' ' || content) @@ plainto_tsquery('spanish', $1)
      ORDER BY rank DESC
      LIMIT 10
    `, [q]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all knowledge entries
app.get('/api/ai/knowledge', async (_req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, title, content, metadata, created_at FROM ai_knowledge_embeddings ORDER BY created_at DESC LIMIT 100'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------------------------------
// SERVE FRONTEND STATIC FILES (SPA)
// ------------------------------------------------------------------
const distPath = fs.existsSync(path.resolve(__dirname, '../dist'))
  ? path.resolve(__dirname, '../dist')
  : path.resolve(__dirname, 'dist');

if (fs.existsSync(distPath)) {
  console.log(`📁 Sirviendo frontend desde: ${distPath}`);
  app.use(express.static(distPath));

  // SPA fallback para rutas que no sean /api ni /health
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ------------------------------------------------------------------
// START SERVER
// ------------------------------------------------------------------

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`\n🚀 Servidor CasaYa CRM ejecutándose en http://0.0.0.0:${PORT}`);
  console.log(`🔗 Webhook URL: http://0.0.0.0:${PORT}/api/whatsapp/webhook`);
  console.log(`🧠 Knowledge API: http://0.0.0.0:${PORT}/api/ai/knowledge`);

  try {
    await initDb();
  } catch (err) {
    console.error('⚠️ Error al inicializar base de datos PostgreSQL:', err.message);
  }
});
