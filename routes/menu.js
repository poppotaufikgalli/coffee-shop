var express = require('express');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();
var router = express.Router();
const multer  = require('multer')

const table = require('../models/TableData')

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

router.get('/api/menu/:id?', async function(req, res) {
  var id = req.params.id
  var sql = `select menu.*, menu_kategori.nama_kategori from menu left join menu_kategori on (menu.kategori = menu_kategori.id) where menu.status =1`
  if(id == null){
    var results = await table.Query(sql);
    return res.json({ data: results })
  }else{
    var results = await table.Find('menu', {'id': id});
    return res.json({ data: results })
  }
});

router.get('/data-menu', function(req, res) {
  res.render('menu/menu', {
    title: 'Data Menu',
  });
});

router.post('/api/delete-menu',async function(req, res){
  var id = req.body.id;
  var uid = req.session.passport.user.id_karyawan
  if(id !== null){
    var results = await table.Delete('menu', {'id': id}, uid);
    return res.json({ ok: true, data: results })
    
  }else{
    return res.json({ ok: false })
  }
})

router.post('/data-menu/:id?', upload.single('gambar'), async function(req, res) {
  var id = req.params.id
  var uid = req.session.passport.user.id_karyawan
  const {nama_produk, kategori, harga} = req.body;
  if(id != null){

    var keys = {'id': id}
    var data = {
      "nama_produk": nama_produk,
      "kategori": kategori,
      "harga": harga,
      "updated_uid": uid,
    }

    if(req.file !== undefined){
      data['gambar'] =  req.file.filename
    }

    await table.Update("menu", data, keys)
  }else{
    var data = {
      "nama_produk": nama_produk,
      "kategori": kategori,
      "harga": harga,
      "created_uid": uid,
    }

    if(req.file !== undefined){
      data['gambar'] =  req.file.filename
    }
    await table.Create("menu", data)
  }

  res.redirect('/data-menu');
});

router.get('/form-menu/:id?', async function(req, res) {
  var id = req.params.id
  var lsKategori = await table.All('menu_kategori')
  //console.log(lsKategori)
  res.render('menu/form', {
    title: 'Form Menu',
    kategori: lsKategori,
    id: id,
  });
});

module.exports = router;