const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' })); // Increase body size limit
app.use(express.static('public'));

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'facejava'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Use sendFile to serve the HTML file
});

app.post('/upload', (req, res) => {
  const { idfoto, nama, jabatan, photoData } = req.body;

  if (!photoData) {
    console.error('Photo data is missing');
    return res.status(400).send('Photo data is missing');
  }

  console.log('Received photo data:', photoData); // Debug log

  // Convert base64 to binary image
  const base64Data = photoData.replace(/^data:image\/jpeg;base64,/, "");
  const filePath = path.join(__dirname, 'public', 'dataset', `${idfoto}.jpg`);
  
  console.log('Saving photo to:', filePath); // Debug log
  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send('Error saving photo');
    }
    
    const sql = 'INSERT INTO user (idfoto, nama, jabatan) VALUES (?, ?, ?)';
    db.query(sql, [idfoto, nama, jabatan], (err, result) => {
      if (err) {
        console.error('Error inserting into database:', err);
        return res.status(500).send('Error saving user data');
      }
      res.redirect('/');
    });
  });
});

// Mengambil ID dengan validasi file di folder dataset
app.get('/get-ids', (req, res) => {
  const sql = 'SELECT idfoto FROM user';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching ids:', err);
      return res.status(500).send('Error fetching ids');
    }

    const validIds = results
      .map(row => row.idfoto)
      .filter(id => fs.existsSync(path.join(__dirname, 'public', 'dataset', `${id}.jpg`))); // Validasi file

    res.json(validIds);
  });
});

app.get('/user-info/:idfoto', (req, res) => {
  const sql = 'SELECT * FROM user WHERE idfoto = ?';
  
  db.query(sql, [req.params.idfoto], (err, results) => {
    if (err) {
      console.error('Error fetching user info:', err);
      return res.status(500).send('Error fetching user info');
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.json(null);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
