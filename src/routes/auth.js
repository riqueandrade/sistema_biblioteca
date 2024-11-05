const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Registro de usuário
router.post('/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // Verificar se o email já existe
        const [usuarios] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (usuarios.length > 0) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // Inserir usuário
        const [result] = await db.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senhaHash]
        );

        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Verificar se o email foi fornecido
        if (!email) {
            return res.status(400).json({ message: 'Por favor, insira seu email' });
        }

        // Verificar se a senha foi fornecida
        if (!senha) {
            return res.status(400).json({ message: 'Por favor, insira sua senha' });
        }

        // Buscar usuário
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        // Verificar se o email existe
        if (usuarios.length === 0) {
            return res.status(401).json({ message: 'Email não cadastrado' });
        }

        const usuario = usuarios[0];

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        // Gerar token
        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            nome: usuario.nome
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router; 