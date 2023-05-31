const express = require('express');
const app = express();
const config = require('./config');
const path = require('path');

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/produtos', async (req, res) => {
  try {
    const { data: produtos, error } = await supabase
      .from(config.supabaseTable)
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/produtos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { data: produtos, error } = await supabase
        .from(config.supabaseTable)
        .select('*')
        .eq('id', id);
  
      if (error) {
        throw new Error(error.message);
      }
  
      if (produtos.length === 0) {
        res.status(404).json({ error: 'Produto não encontrado' });
        return;
      }
  
      const produto = produtos[0];
      res.json(produto);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
  
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
