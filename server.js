const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 4000;

const db = new sqlite3.Database(path.resolve(__dirname, 'tasks.db'));

app.use(cors());
app.use(express.json());

db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT,
  completed BOOLEAN DEFAULT 0
)`);
app.get('/',(req,res)=>{
    res.send('its working upender')
})
app.get('/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

app.post('/tasks', (req, res) => {
  const { name } = req.body;
  db.run("INSERT INTO tasks (description) VALUES (?)", [description], function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ id: this.lastID, description, completed: 0 });
    }
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", [id], function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.sendStatus(204);
    }
  });
});

app.patch('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    db.run("UPDATE tasks SET completed = ? WHERE id = ?", [completed, id], function (err) {
      if (err) {
        res.status(500).send(err.message);
      } else if (this.changes === 0) {
        res.status(404).send('Task not found');
      } else {
        res.json({ id, completed });
      }
    });
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
