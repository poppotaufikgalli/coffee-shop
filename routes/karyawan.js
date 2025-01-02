var express = require('express');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();
var router = express.Router();
var crypto = require('crypto');
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

router.get('/data-karyawan', function(req, res) {
  res.render('karyawan/karyawan', {
    title: 'Data Karyawan',
  });
});

router.get('/api/karyawan/:id?', async function(req, res) {
  var id = req.params.id
  //var sql = `select karyawan.* from menu left join menu_kategori on (menu.kategori = menu_kategori.id) where menu.status =1`
  if(id == null){
    var results = await table.All('karyawan');
    return res.json({ data: results })
  }else{
    var results = await table.Find('karyawan', {'id': id});
    return res.json({ data: results })
  }
});

router.get('/form-karyawan/:id?', async function(req, res) {
  var id = req.params.id
  var lsRole = await table.All('role')
  //console.log(lsKategori)
  res.render('karyawan/form', {
    title: 'Form Karyawan',
    kategori: lsRole,
    id: id,
  });
});

router.post('/data-karyawan/:id?', upload.single('foto'), async function(req, res) {
  var id = req.params.id
  var uid = req.session.passport.user.id_karyawan
  const {nama_karyawan, tanggal_mulai, username, password, role} = req.body;
  if(id != null){

    var keys = {'id': id}
    var data = {
      "nama_karyawan": nama_karyawan,
      "tanggal_mulai": tanggal_mulai,
      "username": username,
      //"password": password,
      "role": role,
      "updated_uid": uid,
    }

    if(req.file !== undefined){
      data['foto'] =  req.file.filename
    }

    await table.Update("karyawan", data, keys)
  }else{
    var salt = crypto.randomBytes(1024).toString('hex');

    const hash = crypto.pbkdf2Sync(password, salt, 10000, 521, "sha512") .toString("hex"); 
    console.log(hash)

    var data = {
      "nama_karyawan": nama_karyawan,
      "tanggal_mulai": tanggal_mulai,
      "username": username,
      "hash": hash,
      "salt": salt,
      "role": role,
      "created_uid": uid,
    }

    if(req.file !== undefined){
      data['foto'] =  req.file.filename
    }
    await table.Create("karyawan", data)
  }

  res.redirect('/data-karyawan');
});

module.exports = router;