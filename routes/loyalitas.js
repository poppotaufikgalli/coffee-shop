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
            cb(null, `public/uploads/karyawan/`);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
});

router.get('/program-loyalitas', function(req, res) {
  res.render('loyalitas/loyalitas', {
    title: 'Program Loyalitas',
  });
});

router.get('/api/loyalitas/:id?', async function(req, res) {
  var id = req.params.id
  //var sql = `select karyawan.* from karyawan left join role on (karyawan.role = role.id) where karyawan.status =1`
  if(id == null){
    //var results = await table.Query(sql);
    var results = await table.All('loyalitas');
    return res.json({ data: results })
  }else{
    var results = await table.Find('loyalitas', {'id_loyalitas': id});
    return res.json({ data: results })
  }
});

router.get('/form-loyalitas/:id?', async function(req, res) {
  var id = req.params.id
  //var lsRole = await table.All('role')
  //console.log(lsKategori)
  res.render('loyalitas/form', {
    title: 'Form Program Loyalitas',
    //kategori: lsRole,
    id: id,
  });
});

/*router.post('/data-karyawan/:id?', upload.single('foto'), async function(req, res) {
  var id = req.params.id
  var uid = req.session.passport.user.id_karyawan
  const {nama_karyawan, tanggal_mulai, username, password, role} = req.body;
  if(id != null){

    var keys = {'id_karyawan': id}
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
    //console.log(req.body)
    var salt = crypto.randomBytes(86).toString('hex');

    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString("hex"); 

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

router.post('/api/delete-karyawan',async function(req, res){
  var id = req.body.id;
  var uid = req.session.passport.user.id_karyawan
  if(id !== null){
    var results = await table.Delete('karyawan', {'id_karyawan': id}, uid);
    return res.json({ ok: true, data: results })
    
  }else{
    return res.json({ ok: false })
  }
})

router.post('/api/reset-password/:id?',async function(req, res){
  var id = req.params.id;
  var uid = req.session.passport.user.id_karyawan
  const {password} = req.body;
  if(id !== null){
    var keys = {'id_karyawan': id}
    var salt = crypto.randomBytes(86).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString("hex"); 

    var data = {
      "hash": hash,
      "salt": salt,
      "updated_uid": uid,
    }

    var results = await table.Update('karyawan', data, keys);
    return res.json({ ok: true, data: results })
    
  }else{
    return res.json({ ok: false })
  }
})*/

module.exports = router;