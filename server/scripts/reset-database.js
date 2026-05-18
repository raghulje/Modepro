/**
 * Drop modepro_cms database, recreate schema, import seed data.
 * Usage: node scripts/reset-database.js (from server/)
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const DB_DIR = path.join(__dirname, '../../database');
const SETUP_SQL = path.join(DB_DIR, 'modepro_cms_setup.sql');
const SEED_SQL = path.join(DB_DIR, 'modepro_seed_data.sql');

async function run() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  if (!DB_USER || !DB_PASSWORD) {
    throw new Error('DB_USER and DB_PASSWORD must be set in server/.env');
  }

  console.log('Connecting to MySQL...');
  const conn = await mysql.createConnection({
    host: DB_HOST || 'localhost',
    port: Number(DB_PORT) || 3306,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  });

  try {
    console.log(`Dropping database ${DB_NAME || 'modepro_cms'}...`);
    await conn.query(`DROP DATABASE IF EXISTS \`${DB_NAME || 'modepro_cms'}\``);

    console.log('Running modepro_cms_setup.sql...');
    const setup = fs.readFileSync(SETUP_SQL, 'utf8');
    await conn.query(setup);

    console.log('Running modepro_seed_data.sql...');
    const seed = fs.readFileSync(SEED_SQL, 'utf8');
    await conn.query(seed);

    const [tables] = await conn.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = ?`,
      [DB_NAME || 'modepro_cms']
    );
    const [users] = await conn.query(`SELECT COUNT(*) AS cnt FROM \`${DB_NAME || 'modepro_cms'}\`.users`);
    const [products] = await conn.query(
      `SELECT COUNT(*) AS cnt FROM \`${DB_NAME || 'modepro_cms'}\`.products`
    );
    const [nav] = await conn.query(
      `SELECT COUNT(*) AS cnt FROM \`${DB_NAME || 'modepro_cms'}\`.navigation_items`
    );

    console.log('\nDatabase reset complete.');
    console.log(`  Tables: ${tables[0].cnt}`);
    console.log(`  Users: ${users[0].cnt}`);
    console.log(`  Products: ${products[0].cnt}`);
    console.log(`  Navigation items: ${nav[0].cnt}`);
    console.log('\nAdmin login: admin@modepro.com / Modepro@123');
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error('Database reset failed:', err.message);
  process.exit(1);
});
