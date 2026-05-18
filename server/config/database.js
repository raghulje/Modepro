require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const base = {
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  timezone: '+05:30',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
};

module.exports = {
  development: {
    ...base,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'modepro_cms',
  },
  test: {
    ...base,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'modepro_cms_test',
  },
  production: {
    ...base,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'modepro_cms',
  },
};
