'use strict'

const express = require('express');
const expressLayouts = require('express-ejs-layouts')
//var hash = require('pbkdf2-password')()
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const fs = require('fs');
var session = require('express-session');
const crypto = require('crypto');
//var logger = require('morgan');
const passport = require('passport')
//const {loginCheck} = require('./auth/passport')
//loginCheck(passport)

//const faceapi = require("face-api.js");
//const canvas = require("canvas");

//const { Canvas, Image, ImageData } = canvas;
//faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
var db = require('./config/database');
const table = require('./models/TableData')

const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json({ limit: '10mb' })); // Increase body size limit
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'public/css')))
app.use('/models', express.static(path.join(__dirname, 'public/models')))
app.use('/js', express.static(path.join(__dirname, 'public/js')))
app.use('/img', express.static(path.join(__dirname, 'public/img')))

app.use(expressLayouts)
app.set('layout', './layouts/default')
app.set('view engine', 'ejs');

// middleware

//app.use(express.urlencoded())
const sessionOptions = {
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret',
  cookie: {
    maxAge: 36000000,
  },
};

if (app.get('env') === 'production') {
  sessionOptions.cookie.secure = true
}

app.use(session(sessionOptions))

// Session-persisted message middleware

/*app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<div class="alert alert-danger alert-dismissible fade show" role="alert">' + err + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
  if (msg) res.locals.message = '<div class="alert alert-success alert-dismissible fade show" role="alert">' + msg + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
  res.locals.user = req.session.user;
  next();
});*/

//User session 
app.use(passport.initialize())
app.use(passport.authenticate('session'));

app.use(function(req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  res.locals.user = req.user;
  //console.log(passport)
  next();
});

/*const a = require('./models/TableData')
console.log(a.Delete(
  'menu', 
  //{"status": 0, 'nama_kategori': "abu"}, 
  {"id": 1, "is": 1}
))*/

app.use('/', require('./routes/login'))
app.use('/', require('./routes/loyalitas'))
app.use('/', require('./routes/karyawan'))
app.use('/', require('./routes/menu'))
app.use('/', require('./routes/pelanggan'))
app.use('/', require('./routes/transaksi'))
app.use('/', require('./routes/kasir'))
app.use('/', require('./routes/index'))


// Routes
/*app.get('/', restrict, (req, res) => {
  //res.sendFile(path.join(__dirname, 'public', 'views', 'index.html')); // Use sendFile to serve the HTML file
  res.render('dashboard', {
    title: 'Dashboard'
  });
});

app.get('/dashboard', restrict, (req, res) => {
  //res.sendFile(path.join(__dirname, 'public', 'views', 'index.html')); // Use sendFile to serve the HTML file
  res.render('dashboard', {
    title: 'Dashboard'
  });
});

app.get('/data-transaksi', restrict, (req, res) => {
  //res.sendFile(path.join(__dirname, 'public', 'views', 'index.html')); // Use sendFile to serve the HTML file
  res.render('data-transaksi', {
    title: 'Data Transaksi'
  });
});

app.get('/data-pelanggan', restrict, (req, res) => {
  //res.sendFile(path.join(__dirname, 'public', 'views', 'index.html')); // Use sendFile to serve the HTML file
  res.render('data-pelanggan', {
    title: 'Data Pelanggan'
  });
});

app.get('/data-menu', restrict, (req, res) => {
  //res.sendFile(path.join(__dirname, 'public', 'views', 'index.html')); // Use sendFile to serve the HTML file
  res.render('data-menu', {
    title: 'Data Menu'
  });
});

app.get('/data-karyawan', restrict, (req, res) => {
  const sql = 'SELECT * FROM users';

  db.query(sql, (err, result) => {
    if (err || result.length == 0) {
      console.error('Error select user:', err);
      return fn(null, null)
      //return res.status(500).send('Error saving user data');
    }

    const user = result[0]

    crypto.pbkdf2(password, user.salt, 10000, 512, 'sha512', (err, hash) => {
        if (user.hash.toString() === hash.toString('hex')) {
          //res.sendStatus(200);
          return fn(null, user)
        } else {
          //res.sendStatus(401);
          return fn(null, null)
        }
      }
    );
  });

  //res.sendFile(path.join(__dirname, 'public', 'views', 'index.html')); // Use sendFile to serve the HTML file
  res.render('data-karyawan', {
    title: 'Data Karyawan'
  });
});

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    layout: 'layouts/login',
  });
});

app.post('/login', (req, res, next) => {
  if (!req.body) return res.sendStatus(400)
  authenticate(req.body.username, req.body.password, function(err, user){
    if (err) return next(err)
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        //res.locals.user = user;
        req.session.success = 'Authenticated as ' + user.name;
        res.redirect('/');
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.'
      res.redirect('/login');
    }
  });
});

app.get('/logout', (req, res) => {
  //res.sendFile(path.join(__dirname, 'public', 'views', 'index.html')); // Use sendFile to serve the HTML file
  req.session.destroy(function(){
    res.redirect('/login');
  });
});

app.get('/transaksi', (req, res) => {
  //res.sendFile(path.join(__dirname, 'public', 'views', 'index.html')); // Use sendFile to serve the HTML file
  res.render('transaksi', {
    title: 'Transaksi',
    layout: 'layouts/transaksi',
  });
});*/

/*app.post('/upload', (req, res) => {
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
});*/

// Mengambil ID dengan validasi file di folder dataset
app.get('/get-ids', async(req, res) => {
  const sql = 'SELECT foto_pelanggan FROM pelanggan';

  var results = await table.All('pelanggan')
  //console.log(results)

  const validIds = results
      .map(row => row.foto_pelanggan)
      //.filter(id => fs.existsSync(path.join(__dirname, 'public', 'dataset', `${id}.jpg`))); // Validasi file
      .filter(kode_pelanggan => fs.existsSync(path.join(__dirname, 'public', 'dataset', `${kode_pelanggan}`))); // Validasi file

      console.log(validIds)

    res.json(validIds);

  /*db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching ids:', err);
      return res.status(500).send('Error fetching ids');
    }

    
  });*/
});

app.get('/user-info/:idfoto', (req, res) => {
  const sql = 'SELECT * FROM pelanggan WHERE foto_pelanggan = ?';
  
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
