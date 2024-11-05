const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Listar todos os livros
router.get('/', async (req, res) => {
  try {
    const [livros] = await db.query('SELECT * FROM livros');
    res.json(livros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Adicionar novo livro
router.post('/', async (req, res) => {
  try {
    const { titulo, autor, ano } = req.body;
    const [result] = await db.query(
      'INSERT INTO livros (titulo, autor, ano) VALUES (?, ?, ?)',
      [titulo, autor, ano]
    );
    res.status(201).json({ id: result.insertId, titulo, autor, ano });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar livro
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, ano } = req.body;
    const [result] = await db.query(
      'UPDATE livros SET titulo = ?, autor = ?, ano = ? WHERE id = ?',
      [titulo, autor, ano, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    
    res.json({ id, titulo, autor, ano });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar livro
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM livros WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    
    res.json({ message: 'Livro deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 