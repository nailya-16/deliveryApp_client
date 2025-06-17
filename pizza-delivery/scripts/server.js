const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

const pizzasPath = path.join(__dirname, '../server-data/pizzas.json');

app.get("/api/pizzas", (req, res) => {
  fs.readFile(pizzasPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Ошибка чтения файла' });
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
})