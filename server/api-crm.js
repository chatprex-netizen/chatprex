import { Router } from 'express';
import { query } from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateData, loginSchema, agentSchema, propertySchema, contactSchema, dealSchema, taskSchema, appointmentSchema } from './validators.js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'krayin_default_secret_change_me';
const JWT_EXPIRES_IN = '24h';

// ══════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════

/** Convierte camelCase a snake_case */
const toSnake = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

/** Convierte snake_case a camelCase */
const toCamel = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

/** Convierte claves de un objeto de snake_case a camelCase */
const rowToCamel = (row) => {
  if (!row) return null;
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    out[toCamel(k)] = v;
  }
  return out;
};

/** Convierte un array de filas */
const rowsToCamel = (rows) => rows.map(rowToCamel);

// ══════════════════════════════════════════════════
// AUTH: LOGIN (Ruta Pública)
// ══════════════════════════════════════════════════

router.post('/api/crm/auth/login', validateData(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    // Buscar agente por email
    const { rows } = await query('SELECT * FROM agents WHERE LOWER(email) = LOWER($1)', [email]);
    const agent = rows[0];

    if (!agent) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!agent.password_hash) {
      return res.status(401).json({ error: 'Este usuario no tiene contraseña configurada. Contacta al administrador.' });
    }

    // Verificar contraseña
    const isValid = await bcrypt.compare(password, agent.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar que el agente esté activo
    if (agent.active === false) {
      return res.status(403).json({ error: 'Tu cuenta está desactivada. Contacta al administrador.' });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: agent.id,
        email: agent.email,
        name: agent.name,
        role: agent.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Devolver token y datos del agente (sin password_hash)
    const { password_hash, ...agentSafe } = agent;
    res.json({
      token,
      agent: rowToCamel(agentSafe),
    });
  } catch (err) {
    console.error('[Auth] Login error:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Verificar token (para que el frontend valide si la sesión sigue activa)
router.get('/api/crm/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const { rows } = await query('SELECT * FROM agents WHERE id = $1', [decoded.id]);
    const agent = rows[0];
    if (!agent || agent.active === false) {
      return res.status(401).json({ error: 'Usuario no encontrado o desactivado' });
    }

    const { password_hash, ...agentSafe } = agent;
    res.json({ agent: rowToCamel(agentSafe) });
  } catch (err) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

// ══════════════════════════════════════════════════
// AUTH MIDDLEWARE (Protege todas las rutas siguientes)
// ══════════════════════════════════════════════════

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Acceso no autorizado. Debes iniciar sesión.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, name, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado. Inicia sesión nuevamente.' });
  }
};

// Aplicar middleware a TODAS las rutas CRM después de este punto
router.use('/api/crm', authMiddleware);

// ══════════════════════════════════════════════════
// AGENTS
// ══════════════════════════════════════════════════

router.get('/api/crm/agents', async (_req, res) => {
  try {
    const { rows } = await query('SELECT id, name, email, phone, role, avatar, active, active_deals_count, sales_volume, created_at FROM agents ORDER BY name');
    res.json(rowsToCamel(rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/crm/agents', validateData(agentSchema), async (req, res) => {
  try {
    const { name, email, password, phone, role, avatar, active } = req.body;
    const agentId = `agent-${Date.now()}`;

    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 12);
    }

    await query(
      `INSERT INTO agents (id, name, email, password_hash, phone, role, avatar, active, active_deals_count, sales_volume)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, 0)`,
      [agentId, name, email, passwordHash, phone, role || 'agente', avatar, active !== false]
    );

    res.status(201).json({ id: agentId, message: 'Agente creado' });
  } catch (err) {
    if (err.code === '23505') { // unique_violation
      return res.status(409).json({ error: 'Ya existe un agente con ese email' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/crm/agents/:id', validateData(agentSchema), async (req, res) => {
  try {
    const fields = req.body;
    const sets = [];
    const vals = [];
    let idx = 1;

    for (const [key, value] of Object.entries(fields)) {
      if (key === 'id') continue;

      // Si se envía 'password', hashear y guardar como password_hash
      if (key === 'password') {
        if (value) {
          const hashed = await bcrypt.hash(value, 12);
          sets.push(`password_hash = $${idx}`);
          vals.push(hashed);
          idx++;
        }
        continue;
      }

      sets.push(`${toSnake(key)} = $${idx}`);
      vals.push(value);
      idx++;
    }

    if (sets.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    vals.push(req.params.id);
    await query(`UPDATE agents SET ${sets.join(', ')} WHERE id = $${idx}`, vals);
    res.json({ message: 'Agente actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/crm/agents/:id', async (req, res) => {
  try {
    await query('DELETE FROM agents WHERE id = $1', [req.params.id]);
    res.json({ message: 'Agente eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════
// CONTACTS
// ══════════════════════════════════════════════════

router.get('/api/crm/contacts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    
    let whereClause = '';
    const params = [];
    if (search) {
      whereClause = 'WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1';
      params.push(`%${search}%`);
    }

    const { rows } = await query(`SELECT * FROM contacts ${whereClause} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, [...params, limit, offset]);
    
    const countRes = await query(`SELECT COUNT(*) FROM contacts ${whereClause}`, params);
    const total = parseInt(countRes.rows[0].count);

    res.json({
      data: rowsToCamel(rows),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/crm/contacts/:id', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM contacts WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Contacto no encontrado' });
    res.json(rowToCamel(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/crm/contacts', validateData(contactSchema), async (req, res) => {
  try {
    const { id, name, email, phone, type, channel, budgetMin, budgetMax, budget, currency, pipelineStage,
      interestedProperty, preferredZones, preferredTypes, leadScore, notes, assignedAgentId,
      nextFollowUpDate, statusFollowUp } = req.body;

    const contactId = id || `cont-${Date.now()}`;
    await query(`
      INSERT INTO contacts (id, name, email, phone, type, channel, budget_min, budget_max, budget, currency,
        pipeline_stage, interested_property, preferred_zones, preferred_types, lead_score, notes,
        assigned_agent_id, last_contact_date, next_follow_up_date, status_follow_up)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,NOW(),$18,$19)
    `, [contactId, name, email, phone, type, channel, budgetMin, budgetMax, budget, currency,
      pipelineStage, interestedProperty, preferredZones || [], preferredTypes || [],
      leadScore || 0, notes, assignedAgentId, nextFollowUpDate, statusFollowUp || 'al_dia']);

    res.status(201).json({ id: contactId, message: 'Contacto creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/crm/contacts/:id', validateData(contactSchema), async (req, res) => {
  try {
    const fields = req.body;
    const sets = [];
    const vals = [];
    let idx = 1;

    for (const [key, value] of Object.entries(fields)) {
      if (key === 'id') continue;
      sets.push(`${toSnake(key)} = $${idx}`);
      vals.push(value);
      idx++;
    }

    if (sets.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

    vals.push(req.params.id);
    await query(`UPDATE contacts SET ${sets.join(', ')} WHERE id = $${idx}`, vals);
    res.json({ message: 'Contacto actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/crm/contacts/:id', async (req, res) => {
  try {
    await query('DELETE FROM contacts WHERE id = $1', [req.params.id]);
    res.json({ message: 'Contacto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════
// PROPERTIES
// ══════════════════════════════════════════════════

router.get('/api/crm/properties', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const search = req.query.search || '';
    const type = req.query.type || '';
    const operation = req.query.operation || '';
    const status = req.query.status || '';
    
    let whereClauses = [];
    const params = [];
    let idx = 1;

    if (search) {
      whereClauses.push(`(title ILIKE $${idx} OR description ILIKE $${idx} OR code ILIKE $${idx} OR address ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }
    
    if (type && type !== 'all') {
      whereClauses.push(`type = $${idx}`);
      params.push(type);
      idx++;
    }
    
    if (operation && operation !== 'all') {
      whereClauses.push(`operation = $${idx}`);
      params.push(operation);
      idx++;
    }
    
    if (status && status !== 'all') {
      whereClauses.push(`status = $${idx}`);
      params.push(status);
      idx++;
    }

    const whereStr = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

    const { rows } = await query(`SELECT * FROM properties ${whereStr} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`, [...params, limit, offset]);
    
    const countRes = await query(`SELECT COUNT(*) FROM properties ${whereStr}`, params);
    const total = parseInt(countRes.rows[0].count);

    res.json({
      data: rowsToCamel(rows),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/crm/properties/:id', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM properties WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Propiedad no encontrada' });
    res.json(rowToCamel(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/crm/properties', validateData(propertySchema), async (req, res) => {
  try {
    const { code, title, description, type, operation, price, currency, areaTotal, areaBuilt,
      bedrooms, bathrooms, parkingSpots, address, zone, city, features, status, images,
      agentId, commissionPct, featured, projectName, developer } = req.body;

    const id = `prop-${Date.now()}`;
    await query(`
      INSERT INTO properties (id, code, title, description, type, operation, price, currency,
        area_total, area_built, bedrooms, bathrooms, parking_spots, address, zone, city,
        features, status, images, agent_id, commission_pct, featured, project_name, developer)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
    `, [id, code, title, description, type, operation, price, currency || 'USD',
      areaTotal, areaBuilt, bedrooms, bathrooms, parkingSpots, address, zone, city,
      features || [], status || 'disponible', images || [], agentId, commissionPct || 0,
      featured || false, projectName, developer]);

    res.status(201).json({ id, message: 'Propiedad creada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/crm/properties/:id', validateData(propertySchema), async (req, res) => {
  try {
    const fields = req.body;
    const sets = [];
    const vals = [];
    let idx = 1;

    for (const [key, value] of Object.entries(fields)) {
      if (key === 'id') continue;
      sets.push(`${toSnake(key)} = $${idx}`);
      vals.push(value);
      idx++;
    }

    if (sets.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

    vals.push(req.params.id);
    await query(`UPDATE properties SET ${sets.join(', ')} WHERE id = $${idx}`, vals);
    res.json({ message: 'Propiedad actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/crm/properties/:id', async (req, res) => {
  try {
    await query('DELETE FROM properties WHERE id = $1', [req.params.id]);
    res.json({ message: 'Propiedad eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════
// DEALS (PIPELINE)
// ══════════════════════════════════════════════════

router.get('/api/crm/deals', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const kanban = req.query.kanban === 'true';
    
    let whereClause = '';
    const params = [];
    if (search) {
      whereClause = 'WHERE title ILIKE $1 OR notes ILIKE $1';
      params.push(`%${search}%`);
    }

    let rows;
    if (kanban) {
      const resKanban = await query(`SELECT * FROM deals ${whereClause} ORDER BY created_at DESC`, params);
      rows = resKanban.rows;
    } else {
      const resPaginated = await query(`SELECT * FROM deals ${whereClause} ORDER BY created_at DESC LIMIT ${params.length + 1} OFFSET ${params.length + 2}`, [...params, limit, offset]);
      rows = resPaginated.rows;
    }
    
    const countRes = await query(`SELECT COUNT(*) FROM deals ${whereClause}`, params);
    const total = parseInt(countRes.rows[0].count);

    res.json({
      data: rowsToCamel(rows),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/crm/deals/:id', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM deals WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Deal no encontrado' });
    res.json(rowToCamel(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/crm/deals', validateData(dealSchema), async (req, res) => {
  try {
    const { title, leadId, propertyId, stage, value, currency, probability,
      expectedCloseDate, agentId, priority, notes } = req.body;

    const id = `deal-${Date.now()}`;
    await query(`
      INSERT INTO deals (id, title, lead_id, property_id, stage, value, currency,
        probability, expected_close_date, agent_id, priority, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    `, [id, title, leadId, propertyId, stage || 'nuevo_prospecto', value, currency || 'USD',
      probability || 0, expectedCloseDate, agentId, priority || 'media', notes]);

    res.status(201).json({ id, message: 'Deal creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/crm/deals/:id', validateData(dealSchema), async (req, res) => {
  try {
    const fields = req.body;
    const sets = [];
    const vals = [];
    let idx = 1;

    for (const [key, value] of Object.entries(fields)) {
      if (key === 'id') continue;
      sets.push(`${toSnake(key)} = $${idx}`);
      vals.push(value);
      idx++;
    }

    if (sets.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

    vals.push(req.params.id);
    await query(`UPDATE deals SET ${sets.join(', ')} WHERE id = $${idx}`, vals);
    res.json({ message: 'Deal actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/crm/deals/:id', async (req, res) => {
  try {
    await query('DELETE FROM deals WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deal eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════
// TASKS
// ══════════════════════════════════════════════════

router.get('/api/crm/tasks', async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    let whereClause = '';
    const params = [];
    if (startDate && endDate) {
      whereClause = 'WHERE due_date >= $1 AND due_date <= $2';
      params.push(startDate, endDate);
    }
    const { rows } = await query(`SELECT * FROM tasks ${whereClause} ORDER BY due_date ASC, due_time ASC`, params);
    res.json(rowsToCamel(rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/crm/tasks', validateData(taskSchema), async (req, res) => {
  try {
    const { title, description, type, priority, status, dueDate, dueTime,
      agentId, contactId, propertyId, dealId } = req.body;

    const id = `task-${Date.now()}`;
    await query(`
      INSERT INTO tasks (id, title, description, type, priority, status,
        due_date, due_time, agent_id, contact_id, property_id, deal_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    `, [id, title, description, type || 'seguimiento_general', priority || 'media',
      status || 'pendiente', dueDate, dueTime, agentId, contactId, propertyId, dealId]);

    res.status(201).json({ id, message: 'Tarea creada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/crm/tasks/:id', validateData(taskSchema), async (req, res) => {
  try {
    const fields = req.body;
    const sets = [];
    const vals = [];
    let idx = 1;

    for (const [key, value] of Object.entries(fields)) {
      if (key === 'id') continue;
      sets.push(`${toSnake(key)} = $${idx}`);
      vals.push(value);
      idx++;
    }

    if (sets.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

    vals.push(req.params.id);
    await query(`UPDATE tasks SET ${sets.join(', ')} WHERE id = $${idx}`, vals);
    res.json({ message: 'Tarea actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/crm/tasks/:id', async (req, res) => {
  try {
    await query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════
// APPOINTMENTS
// ══════════════════════════════════════════════════

router.get('/api/crm/appointments', async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    let whereClause = '';
    const params = [];
    if (startDate && endDate) {
      whereClause = 'WHERE date >= $1 AND date <= $2';
      params.push(startDate, endDate);
    }
    const { rows } = await query(`SELECT * FROM appointments ${whereClause} ORDER BY date ASC, time ASC`, params);
    res.json(rowsToCamel(rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/crm/appointments', validateData(appointmentSchema), async (req, res) => {
  try {
    const { title, propertyId, contactId, agentId, date, time,
      durationMinutes, status, location, notes } = req.body;

    const id = `app-${Date.now()}`;
    await query(`
      INSERT INTO appointments (id, title, property_id, contact_id, agent_id, date, time,
        duration_minutes, status, location, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    `, [id, title, propertyId, contactId, agentId, date, time,
      durationMinutes || 60, status || 'programada', location, notes]);

    res.status(201).json({ id, message: 'Cita creada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/crm/appointments/:id', validateData(appointmentSchema), async (req, res) => {
  try {
    const fields = req.body;
    const sets = [];
    const vals = [];
    let idx = 1;

    for (const [key, value] of Object.entries(fields)) {
      if (key === 'id') continue;
      sets.push(`${toSnake(key)} = $${idx}`);
      vals.push(value);
      idx++;
    }

    if (sets.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

    vals.push(req.params.id);
    await query(`UPDATE appointments SET ${sets.join(', ')} WHERE id = $${idx}`, vals);
    res.json({ message: 'Cita actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/crm/appointments/:id', async (req, res) => {
  try {
    await query('DELETE FROM appointments WHERE id = $1', [req.params.id]);
    res.json({ message: 'Cita eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════
// CONTRACTS
// ══════════════════════════════════════════════════

router.get('/api/crm/contracts', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM contracts ORDER BY created_at DESC');
    res.json(rowsToCamel(rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/crm/contracts', async (req, res) => {
  try {
    const { code, type, amount, currency, unit, propertyId, client, contactId,
      agentId, createdDate, status, notes, clientDniRuc, clientAddress,
      clientPhone, clientMaritalStatus, spouseName, spouseDni } = req.body;

    const id = `contr-${Date.now()}`;
    await query(`
      INSERT INTO contracts (id, code, type, amount, currency, unit, property_id, client,
        contact_id, agent_id, created_date, status, notes, client_dni_ruc, client_address,
        client_phone, client_marital_status, spouse_name, spouse_dni)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
    `, [id, code, type, amount, currency || 'USD', unit, propertyId, client,
      contactId, agentId, createdDate, status || 'Borrador', notes, clientDniRuc,
      clientAddress, clientPhone, clientMaritalStatus, spouseName, spouseDni]);

    res.status(201).json({ id, message: 'Contrato creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/crm/contracts/:id', async (req, res) => {
  try {
    const fields = req.body;
    const sets = [];
    const vals = [];
    let idx = 1;

    for (const [key, value] of Object.entries(fields)) {
      if (key === 'id') continue;
      sets.push(`${toSnake(key)} = $${idx}`);
      vals.push(value);
      idx++;
    }

    if (sets.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

    vals.push(req.params.id);
    await query(`UPDATE contracts SET ${sets.join(', ')} WHERE id = $${idx}`, vals);
    res.json({ message: 'Contrato actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/crm/contracts/:id', async (req, res) => {
  try {
    await query('DELETE FROM contracts WHERE id = $1', [req.params.id]);
    res.json({ message: 'Contrato eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════
// COMMISSIONS
// ══════════════════════════════════════════════════

router.get('/api/crm/commissions', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM commissions ORDER BY created_at DESC');
    res.json(rowsToCamel(rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/crm/commissions', async (req, res) => {
  try {
    const { dealId, propertyTitle, clientName, agentId, agentName,
      totalSale, commissionTotal, agencyAmount, agentAmount, status, date } = req.body;

    const id = `comm-${Date.now()}`;
    await query(`
      INSERT INTO commissions (id, deal_id, property_title, client_name, agent_id, agent_name,
        total_sale, commission_total, agency_amount, agent_amount, status, date)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    `, [id, dealId, propertyTitle, clientName, agentId, agentName,
      totalSale, commissionTotal, agencyAmount, agentAmount, status || 'pendiente', date]);

    res.status(201).json({ id, message: 'Comisión creada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════
// FINANCE TRANSACTIONS
// ══════════════════════════════════════════════════

router.get('/api/crm/finance-transactions', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM finance_transactions ORDER BY created_at DESC');
    res.json(rowsToCamel(rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/crm/finance-transactions', async (req, res) => {
  try {
    const { type, category, description, amount, currency, date, status, agentId } = req.body;

    const id = `fin-${Date.now()}`;
    await query(`
      INSERT INTO finance_transactions (id, type, category, description, amount, currency, date, status, agent_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    `, [id, type, category, description, amount, currency || 'USD', date, status || 'pendiente', agentId]);

    res.status(201).json({ id, message: 'Transacción creada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/crm/finance-transactions/:id', async (req, res) => {
  try {
    const fields = req.body;
    const sets = [];
    const vals = [];
    let idx = 1;

    for (const [key, value] of Object.entries(fields)) {
      if (key === 'id') continue;
      sets.push(`${toSnake(key)} = $${idx}`);
      vals.push(value);
      idx++;
    }

    if (sets.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

    vals.push(req.params.id);
    await query(`UPDATE finance_transactions SET ${sets.join(', ')} WHERE id = $${idx}`, vals);
    res.json({ message: 'Transacción actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/crm/finance-transactions/:id', async (req, res) => {
  try {
    await query('DELETE FROM finance_transactions WHERE id = $1', [req.params.id]);
    res.json({ message: 'Transacción eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════
// LEAD ACTIVITIES
// ══════════════════════════════════════════════════

router.get('/api/crm/lead-activities/:contactId', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT * FROM lead_activities WHERE contact_id = $1 ORDER BY created_at DESC',
      [req.params.contactId]
    );
    res.json(rowsToCamel(rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/crm/lead-activities/:contactId', async (req, res) => {
  try {
    const { agentId, agentName, type, summary, description, resultOutcome, timestamp } = req.body;
    const contactId = req.params.contactId;

    const id = `act-${Date.now()}`;
    await query(`
      INSERT INTO lead_activities (id, contact_id, agent_id, agent_name, type, summary,
        description, result_outcome, timestamp)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    `, [id, contactId, agentId, agentName, type, summary, description, resultOutcome, timestamp]);

    // Update contact last_contact_date
    await query('UPDATE contacts SET last_contact_date = NOW(), status_follow_up = $1 WHERE id = $2',
      ['al_dia', contactId]);

    res.status(201).json({ id, message: 'Actividad registrada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════
// PIPELINE STAGES
// ══════════════════════════════════════════════════

router.get('/api/crm/pipeline-stages', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM pipeline_stages ORDER BY sort_order');
    res.json(rowsToCamel(rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/crm/pipeline-stages/:id', async (req, res) => {
  try {
    const { name, color, visible, sortOrder } = req.body;
    await query(
      'UPDATE pipeline_stages SET name = COALESCE($1, name), color = COALESCE($2, color), visible = COALESCE($3, visible), sort_order = COALESCE($4, sort_order) WHERE id = $5',
      [name, color, visible, sortOrder, req.params.id]
    );
    res.json({ message: 'Etapa actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════
// LEAD CHANNELS
// ══════════════════════════════════════════════════

router.get('/api/crm/lead-channels', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM lead_channels ORDER BY name');
    res.json(rowsToCamel(rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/crm/lead-channels/:id', async (req, res) => {
  try {
    const { name, color, details, visible } = req.body;
    await query(
      'UPDATE lead_channels SET name = COALESCE($1, name), color = COALESCE($2, color), details = COALESCE($3, details), visible = COALESCE($4, visible) WHERE id = $5',
      [name, color, details, visible, req.params.id]
    );
    res.json({ message: 'Canal actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════
// PROJECTS
// ══════════════════════════════════════════════════

router.get('/api/crm/projects', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rowsToCamel(rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/crm/projects', async (req, res) => {
  try {
    const { name, developer, contactName, contactEmail, contactPhone, address, notes } = req.body;

    const id = `proj-${Date.now()}`;
    await query(`
      INSERT INTO projects (id, name, developer, contact_name, contact_email, contact_phone, address, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `, [id, name, developer, contactName, contactEmail, contactPhone, address, notes]);

    res.status(201).json({ id, message: 'Proyecto creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/crm/projects/:id', async (req, res) => {
  try {
    const fields = req.body;
    const sets = [];
    const vals = [];
    let idx = 1;

    for (const [key, value] of Object.entries(fields)) {
      if (key === 'id') continue;
      sets.push(`${toSnake(key)} = $${idx}`);
      vals.push(value);
      idx++;
    }

    if (sets.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

    vals.push(req.params.id);
    await query(`UPDATE projects SET ${sets.join(', ')} WHERE id = $${idx}`, vals);
    res.json({ message: 'Proyecto actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/crm/projects/:id', async (req, res) => {
  try {
    await query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.json({ message: 'Proyecto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════

router.get('/api/crm/notifications', async (req, res) => {
  try {
    const userId = req.query.userId;
    const whereClause = userId ? 'WHERE user_id = $1' : '';
    const params = userId ? [userId] : [];
    const { rows } = await query(`SELECT * FROM notifications ${whereClause} ORDER BY created_at DESC LIMIT 50`, params);
    res.json(rowsToCamel(rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/crm/notifications/:id/read', async (req, res) => {
  try {
    await query('UPDATE notifications SET read = TRUE WHERE id = $1', [req.params.id]);
    res.json({ message: 'Notificación marcada como leída' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/crm/notifications/read-all', async (_req, res) => {
  try {
    await query('UPDATE notifications SET read = TRUE');
    res.json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════
// DASHBOARD STATS
// ══════════════════════════════════════════════════

router.get('/api/crm/dashboard/stats', async (_req, res) => {
  try {
    const [
      propertiesRes,
      dealsRes,
      contactsRes,
      tasksRes,
      contractsRes,
      revenueRes
    ] = await Promise.all([
      query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = \'disponible\') as available FROM properties'),
      query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE stage = \'ganado\') as won, SUM(CASE WHEN stage = \'ganado\' THEN value ELSE 0 END) as won_value FROM deals'),
      query('SELECT COUNT(*) as total FROM contacts'),
      query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = \'pendiente\') as pending FROM tasks'),
      query('SELECT COUNT(*) as total FROM contracts'),
      query("SELECT COALESCE(SUM(amount), 0) as total FROM finance_transactions WHERE type = 'ingreso'"),
    ]);

    res.json({
      properties: {
        total: parseInt(propertiesRes.rows[0].total),
        available: parseInt(propertiesRes.rows[0].available),
      },
      deals: {
        total: parseInt(dealsRes.rows[0].total),
        won: parseInt(dealsRes.rows[0].won),
        wonValue: parseFloat(dealsRes.rows[0].won_value || 0),
      },
      contacts: {
        total: parseInt(contactsRes.rows[0].total),
      },
      tasks: {
        total: parseInt(tasksRes.rows[0].total),
        pending: parseInt(tasksRes.rows[0].pending),
      },
      contracts: {
        total: parseInt(contractsRes.rows[0].total),
      },
      revenue: {
        total: parseFloat(revenueRes.rows[0].total),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
