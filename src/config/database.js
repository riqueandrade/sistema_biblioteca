require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convertendo pool para promises
const promisePool = pool.promise();

// Teste de conexão mais suave
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Aviso - Banco de dados:', err.message);
    return;
  }
  if (connection) {
    connection.release();
    console.log('Banco de dados conectado com sucesso');
  }
});

module.exports = promisePool; 