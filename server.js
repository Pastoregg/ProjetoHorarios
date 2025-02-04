const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors')

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
// Configuração do banco de dados SQLite
const db = new sqlite3.Database('./database.db');

// Cria a tabela se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS cidades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      uf TEXT,
      segunda INTEGER,
      terca INTEGER,
      quarta INTEGER,
      quinta INTEGER,
      sexta INTEGER,
      sabado INTEGER,
      domingo INTEGER
    )
  `);
});

// Rota para upload da planilha
app.post('/upload', upload.single('planilha'), (req, res) => {
  const filePath = req.file.path;
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  data.forEach(row => {
    db.run(`
      INSERT INTO cidades (nome, uf, segunda, terca, quarta, quinta, sexta, sabado, domingo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [row['NOME DA CIDADE'], row['UF'], row['SEGUNDA'], row['TERÇA'], row['QUARTA'], row['QUINTA'], row['SEXTA'], row['SÁBADO'], row['DOMINGO']]);
  });

  res.send('Planilha processada e dados inseridos no banco de dados!');
});

// Rota para consulta de cidades (autocomplete)
app.get('/cidades', (req, res) => {
  const query = req.query.q;
  db.all('SELECT nome FROM cidades WHERE nome LIKE ?', [`%${query}%`], (err, rows) => {
    if (err) {
      return res.status(500).send('Erro ao consultar o banco de dados');
    }
    res.json(rows.map(row => row.nome));
  });
});

// Rota para consultar os dados completos de uma cidade
app.get('/cidade/:nome', (req, res) => {
  const nomeCidade = req.params.nome;
  db.get(
    'SELECT * FROM cidades WHERE nome = ?',
    [nomeCidade],
    (err, row) => {
      if (err) {
        return res.status(500).send('Erro ao consultar o banco de dados');
      }
      if (!row) {
        return res.status(404).send('Cidade não encontrada');
      }
      res.json(row);
    }
  );
});

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});