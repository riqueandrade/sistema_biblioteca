require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initializeDatabase = require('./config/initDb');
const authRoutes = require('./routes/auth');
const livrosRoutes = require('./routes/livros');
const authMiddleware = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

async function startServer() {
    try {
        await initializeDatabase();
        console.log('Banco de dados inicializado com sucesso');

        // Rotas públicas
        app.use('/api/auth', authRoutes);
        
        // Rotas protegidas
        app.use('/api/livros', authMiddleware, livrosRoutes);

        app.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Erro fatal ao iniciar aplicação:', error);
        process.exit(1);
    }
}

startServer(); 