module.exports = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
  },
  debug: true
}