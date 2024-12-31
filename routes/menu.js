var express = require('express');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();
var router = express.Router();
const multer  = require('multer')
var db = require('../config/database');
//const upload = multer({ dest: 'public/uploads/menu/' })

const path = require('path');
let upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `public/uploads/menu/`);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
});

function addMenu(nama_produk, kategori, harga, gambar) {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO menu (nama_produk, kategori, harga, gambar) VALUES (?, ?, ?, ?)', [nama_produk, kategori, harga, gambar], (err) => {
      if(err)
        reject(err);
      else
        resolve();
    });
  });
}

router.get('/api/menu/:id?', async function(req, res) {
  var id = req.params.id
  if(id == null){
    db.query('SELECT * FROM menu', function(err, results) {
        if (err) { 
          return res.json({ ok: false, data: [] })
        }
        if (!results || results.length == 0) {
          return res.json({ ok: false, data: [] })
        }
        
        return res.json({ ok: true, data: results })
    });
  }else{
    db.query('SELECT * FROM menu where id', [id], function(err, results) {
        if (err) { 
          return res.json({ ok: false, data: [] })
        }
        if (!results || results.length == 0) {
          return res.json({ ok: false, data: [] })
        }
        
        return res.json({ ok: true, data: results[0] })
    });
  }
});

router.get('/data-menu', function(req, res) {
  res.render('menu/menu', {
    title: 'Data Menu',
  });
});

router.post('/data-menu', upload.single('gambar'), async function(req, res) {
  const {nama_produk, kategori, harga} = req.body;
  console.log(req.body)
  await addMenu(nama_produk, kategori, harga, req.file.filename);

  res.render('menu/menu', {
    title: 'Data Menu',
  });
});

router.get('/form-menu', async function(req, res) {
  

  res.render('menu/form', {
    title: 'Form Menu',
  });
});

/*router.route('/data-menu')
  .get(async function (req, res) {
    var result = getData().then(result => 
        {
            return result;
        }   
    ).catch(err => 
        {
            return null;
        }
    )
    console.log(result)
    res.render('data-menu', {
      title: 'Data Karyawan',
      data: result,
    });
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  });*/

module.exports = router;