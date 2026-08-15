import { Client } from 'pg';
import bcrypt from 'bcryptjs';

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/krayin'
});

async function run() {
  await client.connect();
  const defaultPasswordHash = await bcrypt.hash('@ChatPrex_', 12);
  
  await client.query(`
    INSERT INTO agents (id, name, email, password_hash, role, active, active_deals_count, sales_volume)
    VALUES ('agent-admin', 'Propietario', 'admin@chatprex.com', $1, 'propietario', true, 0, 0)
    ON CONFLICT (id) DO UPDATE SET 
      email = 'admin@chatprex.com',
      password_hash = $1,
      role = 'propietario'
  `, [defaultPasswordHash]);
  
  console.log('Admin updated to admin@chatprex.com / @ChatPrex_');
  await client.end();
}

run().catch(console.error);
