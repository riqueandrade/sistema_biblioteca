require('dotenv').config();
const mysql = require('mysql2/promise');

async function initializeDatabase() {
    let connection;
    try {
        console.log('Iniciando configuração do banco de dados...');
        
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('Conexão inicial estabelecida');

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Banco de dados ${process.env.DB_NAME} criado ou já existente`);

        await connection.query(`USE ${process.env.DB_NAME}`);
        console.log(`Usando banco de dados ${process.env.DB_NAME}`);

        // Criar tabela de usuários
        await connection.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                senha VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('Tabela usuarios criada ou já existente');

        // Criar tabela de livros
        await connection.query(`
            CREATE TABLE IF NOT EXISTS livros (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                autor VARCHAR(255) NOT NULL,
                ano INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('Tabela livros criada ou já existente');

    } catch (error) {
        console.error('Erro durante a inicialização do banco de dados:', error.message);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.end();
                console.log('Conexão inicial fechada');
            } catch (err) {
                console.error('Erro ao fechar conexão:', err.message);
            }
        }
    }
}

module.exports = initializeDatabase; 