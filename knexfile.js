try {
  require('dotenv').config()
} catch (e) {
  console.log('dotenv not found, .env file ignored.')
}

module.exports = {
  client: 'mysql2',
  connection: {
    host: process.env.RDS_HOSTNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    user: process.env.RDS_USERNAME,
    database: process.env.RDS_DB_NAME
  },
  debug: false
}