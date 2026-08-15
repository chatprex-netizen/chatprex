import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { Pool } = pg;

// Pool de conexión a PostgreSQL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/krayin_crm',
  ssl: (process.env.DATABASE_URL?.includes('render.com') ||
        process.env.DATABASE_URL?.includes('neon.tech') ||
        process.env.DATABASE_URL?.includes('supabase.co') ||
        process.env.DATABASE_URL?.includes('pooler.supabase.com') ||
        process.env.DATABASE_URL?.includes('sslmode=require') ||
        process.env.DB_SSL === 'true')
    ? { rejectUnauthorized: false } 
    : false
});

export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // console.log('Query ejecutada', { text, duration, rows: res.rowCount });
  return res;
}

export async function initDb() {
  try {
    const client = await pool.connect();
    console.log('✅ Conectado a la base de datos PostgreSQL exitosamente.');

    // 1. Habilitar extensión pgvector para Búsqueda Vectorial e IA
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
      console.log('⚡ Extensión pgvector habilitada en PostgreSQL.');
    } catch (err) {
      console.warn('⚠️ No se pudo habilitar pgvector automáticamente (puede requerir permisos de superusuario):', err.message);
    }

    // 2. Crear esquemas de tablas — WhatsApp
    await client.query(`
      CREATE TABLE IF NOT EXISTS whatsapp_config (
        id SERIAL PRIMARY KEY,
        phone_number_id TEXT NOT NULL,
        waba_id TEXT,
        access_token TEXT NOT NULL,
        verify_token TEXT,
        app_secret TEXT,
        app_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Tablas CRM — Agentes
    await client.query(`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        password_hash TEXT,
        phone TEXT,
        role TEXT CHECK(role IN ('propietario', 'supervisor', 'agente', 'asistente', 'admin', 'agente_senior', 'agente_junior')) DEFAULT 'agente',
        avatar TEXT,
        active BOOLEAN DEFAULT TRUE,
        active_deals_count INTEGER DEFAULT 0,
        sales_volume NUMERIC(14,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Tablas CRM — Contactos (extendida para CRM + WhatsApp)
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Asegurar que phone no sea NOT NULL ni bloquee nulos
    try {
      await client.query('ALTER TABLE contacts ALTER COLUMN phone DROP NOT NULL;');
    } catch (e) {}
    try {
      await client.query('ALTER TABLE contacts DROP CONSTRAINT IF EXISTS contacts_phone_key;');
    } catch (e) {}

    // Extender contacts con columnas CRM si no existen
    const contactCrmColumns = [
      { name: 'avatar', type: 'TEXT' },
      { name: 'type', type: 'TEXT' },
      { name: 'channel', type: 'TEXT' },
      { name: 'budget_min', type: 'NUMERIC(14,2)' },
      { name: 'budget_max', type: 'NUMERIC(14,2)' },
      { name: 'budget', type: 'NUMERIC(14,2)' },
      { name: 'currency', type: 'TEXT' },
      { name: 'pipeline_stage', type: 'TEXT' },
      { name: 'interested_property', type: 'TEXT' },
      { name: 'preferred_zones', type: 'TEXT[]' },
      { name: 'preferred_types', type: 'TEXT[]' },
      { name: 'lead_score', type: 'INTEGER DEFAULT 0' },
      { name: 'notes', type: 'TEXT' },
      { name: 'assigned_agent_id', type: 'TEXT' },
      { name: 'last_contact_date', type: 'TIMESTAMP' },
      { name: 'next_follow_up_date', type: 'TEXT' },
      { name: 'status_follow_up', type: 'TEXT' },
    ];

    for (const col of contactCrmColumns) {
      try {
        await client.query(`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};`);
      } catch (err) {
        // Column may already exist with a different constraint, ignore
      }
    }

    // 5. Tablas CRM — Proyectos
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        developer TEXT,
        contact_name TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        address TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Tablas CRM — Propiedades
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id TEXT PRIMARY KEY,
        code TEXT,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT CHECK(type IN ('departamento', 'casa', 'penthouse', 'terreno', 'oficina', 'local_comercial', 'proyecto_preventa')),
        operation TEXT CHECK(operation IN ('venta', 'alquiler', 'preventa')),
        price NUMERIC(14,2) DEFAULT 0,
        currency TEXT DEFAULT 'USD',
        area_total NUMERIC(10,2),
        area_built NUMERIC(10,2),
        bedrooms INTEGER DEFAULT 0,
        bathrooms INTEGER DEFAULT 0,
        parking_spots INTEGER DEFAULT 0,
        address TEXT,
        zone TEXT,
        city TEXT,
        features TEXT[],
        status TEXT CHECK(status IN ('disponible', 'en_negociacion', 'reservada', 'vendida', 'alquilada')) DEFAULT 'disponible',
        images TEXT[],
        agent_id TEXT,
        commission_pct NUMERIC(5,2) DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        project_name TEXT,
        developer TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Tablas CRM — Pipeline Stages
    await client.query(`
      CREATE TABLE IF NOT EXISTS pipeline_stages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT,
        visible BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0
      );
    `);

    // 8. Tablas CRM — Lead Channels
    await client.query(`
      CREATE TABLE IF NOT EXISTS lead_channels (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT,
        details TEXT,
        visible BOOLEAN DEFAULT TRUE
      );
    `);

    // 9. Tablas CRM — Deals (Pipeline)
    await client.query(`
      CREATE TABLE IF NOT EXISTS deals (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        lead_id TEXT,
        property_id TEXT,
        stage TEXT CHECK(stage IN ('nuevo_prospecto', 'contactado', 'visita_programada', 'visita_realizada', 'negociacion', 'reserva', 'ganado', 'perdido')) DEFAULT 'nuevo_prospecto',
        value NUMERIC(14,2) DEFAULT 0,
        currency TEXT DEFAULT 'USD',
        probability INTEGER DEFAULT 0,
        expected_close_date TEXT,
        agent_id TEXT,
        priority TEXT CHECK(priority IN ('alta', 'media', 'baja')) DEFAULT 'media',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 10. Tablas CRM — Tareas
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT CHECK(type IN ('llamada', 'whatsapp', 'visita', 'correo', 'documentacion', 'firma_contrato', 'seguimiento_general')) DEFAULT 'seguimiento_general',
        priority TEXT CHECK(priority IN ('alta', 'media', 'baja')) DEFAULT 'media',
        status TEXT CHECK(status IN ('pendiente', 'en_progreso', 'completada', 'cancelada')) DEFAULT 'pendiente',
        due_date TEXT,
        due_time TEXT,
        agent_id TEXT,
        contact_id TEXT,
        property_id TEXT,
        deal_id TEXT,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 11. Tablas CRM — Citas / Agenda
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        property_id TEXT,
        contact_id TEXT,
        agent_id TEXT,
        date TEXT,
        time TEXT,
        duration_minutes INTEGER DEFAULT 60,
        status TEXT CHECK(status IN ('programada', 'confirmada', 'realizada', 'cancelada')) DEFAULT 'programada',
        location TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 12. Tablas CRM — Contratos
    await client.query(`
      CREATE TABLE IF NOT EXISTS contracts (
        id TEXT PRIMARY KEY,
        code TEXT,
        type TEXT CHECK(type IN ('Separación', 'Compraventa', 'Arras', 'Alquiler')),
        amount NUMERIC(14,2) DEFAULT 0,
        currency TEXT DEFAULT 'USD',
        unit TEXT,
        property_id TEXT,
        client TEXT,
        contact_id TEXT,
        agent_id TEXT,
        created_date TEXT,
        status TEXT CHECK(status IN ('Firmado', 'Enviado', 'Pendiente', 'Borrador')) DEFAULT 'Borrador',
        notes TEXT,
        client_dni_ruc TEXT,
        client_address TEXT,
        client_phone TEXT,
        client_marital_status TEXT,
        spouse_name TEXT,
        spouse_dni TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 13. Tablas CRM — Comisiones
    await client.query(`
      CREATE TABLE IF NOT EXISTS commissions (
        id TEXT PRIMARY KEY,
        deal_id TEXT,
        property_title TEXT,
        client_name TEXT,
        agent_id TEXT,
        agent_name TEXT,
        total_sale NUMERIC(14,2) DEFAULT 0,
        commission_total NUMERIC(14,2) DEFAULT 0,
        agency_amount NUMERIC(14,2) DEFAULT 0,
        agent_amount NUMERIC(14,2) DEFAULT 0,
        status TEXT CHECK(status IN ('pendiente', 'facturado', 'pagado')) DEFAULT 'pendiente',
        date TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 14. Tablas CRM — Transacciones Financieras
    await client.query(`
      CREATE TABLE IF NOT EXISTS finance_transactions (
        id TEXT PRIMARY KEY,
        type TEXT CHECK(type IN ('ingreso', 'egreso')),
        category TEXT,
        description TEXT,
        amount NUMERIC(14,2) DEFAULT 0,
        currency TEXT DEFAULT 'USD',
        date TEXT,
        status TEXT CHECK(status IN ('pagado', 'pendiente')) DEFAULT 'pendiente',
        agent_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 15. Tablas CRM — Actividades de Leads
    await client.query(`
      CREATE TABLE IF NOT EXISTS lead_activities (
        id TEXT PRIMARY KEY,
        contact_id TEXT NOT NULL,
        agent_id TEXT,
        agent_name TEXT,
        type TEXT CHECK(type IN ('llamada', 'whatsapp', 'visita', 'correo', 'nota', 'cambio_etapa', 'oferta_recibida')),
        summary TEXT,
        description TEXT,
        result_outcome TEXT CHECK(result_outcome IN ('interesado', 'solicito_visita', 'no_contesto', 'pidio_descuento', 'descartado', 'neutro')),
        timestamp TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 16. Tablas CRM — Notificaciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT,
        time TEXT,
        type TEXT CHECK(type IN ('info', 'success', 'warning')) DEFAULT 'info',
        read BOOLEAN DEFAULT FALSE,
        user_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 17. Tablas WhatsApp — Conversaciones y Mensajes
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        contact_id TEXT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
        last_message_text TEXT,
        last_message_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender_type TEXT CHECK(sender_type IN ('agent', 'contact', 'system')) NOT NULL,
        content_type TEXT CHECK(content_type IN ('text', 'image', 'video', 'document', 'audio', 'interactive', 'template')) NOT NULL,
        content_text TEXT,
        media_url TEXT,
        message_id TEXT UNIQUE, -- Meta's wamid
        status TEXT CHECK(status IN ('sent', 'delivered', 'read', 'failed')) DEFAULT 'sent',
        reply_to_message_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Tabla para Base de Conocimiento de IA con Búsqueda Vectorial (pgvector)
      CREATE TABLE IF NOT EXISTS ai_knowledge_embeddings (
        id SERIAL PRIMARY KEY,
        title TEXT,
        content TEXT NOT NULL,
        metadata JSONB,
        embedding vector(1536), -- Vector para modelos OpenAI text-embedding-3-small
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ──────────────────────────────────────────────
    // SEED DATA
    // ──────────────────────────────────────────────

    // Seed: Agentes
    const { rows: agentCount } = await client.query('SELECT COUNT(*) as count FROM agents');
    if (parseInt(agentCount[0].count, 10) === 0) {
      const agents = [
        { id: 'agent-1', name: 'Ricardo Vargas', email: 'ricardo@inmocrm.pe', phone: '51999888777', role: 'admin', avatar: '', active_deals_count: 5, sales_volume: 850000 },
        { id: 'agent-2', name: 'Sofía Herrera', email: 'sofia@inmocrm.pe', phone: '51999777666', role: 'agente_senior', avatar: '', active_deals_count: 3, sales_volume: 520000 },
      ];
      for (const a of agents) {
        await client.query(
          `INSERT INTO agents (id, name, email, phone, role, avatar, active_deals_count, sales_volume)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING`,
          [a.id, a.name, a.email, a.phone, a.role, a.avatar, a.active_deals_count, a.sales_volume]
        );
      }
      console.log('🌱 Seed: Agentes insertados.');
    }

    // Seed: Pipeline Stages
    const { rows: stageCount } = await client.query('SELECT COUNT(*) as count FROM pipeline_stages');
    if (parseInt(stageCount[0].count, 10) === 0) {
      const stages = [
        { id: 'stage-1', name: 'Nuevo Prospecto', color: '#6366f1', sort_order: 1 },
        { id: 'stage-2', name: 'Contactado', color: '#3b82f6', sort_order: 2 },
        { id: 'stage-3', name: 'Visita Programada', color: '#f59e0b', sort_order: 3 },
        { id: 'stage-4', name: 'Visita Realizada', color: '#f97316', sort_order: 4 },
        { id: 'stage-5', name: 'Negociación', color: '#8b5cf6', sort_order: 5 },
        { id: 'stage-6', name: 'Reserva', color: '#06b6d4', sort_order: 6 },
        { id: 'stage-7', name: 'Ganado', color: '#10b981', sort_order: 7 },
        { id: 'stage-8', name: 'Perdido', color: '#ef4444', sort_order: 8 },
      ];
      for (const s of stages) {
        await client.query(
          `INSERT INTO pipeline_stages (id, name, color, visible, sort_order)
           VALUES ($1, $2, $3, TRUE, $4) ON CONFLICT DO NOTHING`,
          [s.id, s.name, s.color, s.sort_order]
        );
      }
      console.log('🌱 Seed: Pipeline stages insertados.');
    }

    // Seed: Lead Channels
    const { rows: channelCount } = await client.query('SELECT COUNT(*) as count FROM lead_channels');
    if (parseInt(channelCount[0].count, 10) === 0) {
      const channels = [
        { id: 'ch-1', name: 'Portal Web', color: '#3b82f6' },
        { id: 'ch-2', name: 'Referido', color: '#10b981' },
        { id: 'ch-3', name: 'WhatsApp', color: '#22c55e' },
        { id: 'ch-4', name: 'Instagram', color: '#ec4899' },
        { id: 'ch-5', name: 'Facebook', color: '#1d4ed8' },
        { id: 'ch-6', name: 'Llamada', color: '#f59e0b' },
      ];
      for (const c of channels) {
        await client.query(
          `INSERT INTO lead_channels (id, name, color, visible)
           VALUES ($1, $2, $3, TRUE) ON CONFLICT DO NOTHING`,
          [c.id, c.name, c.color]
        );
      }
      console.log('🌱 Seed: Lead channels insertados.');
    }

    // Migración: Añadir columnas nuevas a agents (para bases de datos existentes)
    const agentMigrationCols = [
      { name: 'password_hash', type: 'TEXT' },
      { name: 'active', type: 'BOOLEAN DEFAULT TRUE' },
    ];
    for (const col of agentMigrationCols) {
      try {
        await client.query(`ALTER TABLE agents ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};`);
      } catch (err) {
        // Column may already exist
      }
    }

    // Asegurar que exista admin@chatprex.com
    try {
      const adminCheck = await client.query(`SELECT email FROM agents WHERE id = 'agent-admin'`);
      if (adminCheck.rows.length === 0 || adminCheck.rows[0].email !== 'admin@chatprex.com') {
        const defaultPasswordHash = await bcrypt.hash('@ChatPrex_', 12);
        await client.query(
          `INSERT INTO agents (id, name, email, password_hash, role, active, active_deals_count, sales_volume)
           VALUES ($1, $2, $3, $4, 'propietario', true, 0, 0)
           ON CONFLICT (id) DO UPDATE SET email = $3, password_hash = $4, role = 'propietario'`,
          [
            'agent-admin',
            'Propietario',
            'admin@chatprex.com',
            defaultPasswordHash
          ]
        );
        console.log('🔐 Seed: Usuario admin actualizado a (admin@chatprex.com / @ChatPrex_)');
      }
    } catch (err) {
      console.warn('⚠️ No se pudo crear/actualizar el usuario admin seed:', err.message);
    }

    client.release();
    console.log('📦 Todas las tablas CRM creadas/verificadas exitosamente.\n');
  } catch (err) {
    console.error('❌ Error al conectar o inicializar PostgreSQL:', err.message);
    console.info('💡 Asegúrate de tener PostgreSQL ejecutándose y configurar DATABASE_URL en server/.env');
  }
}
