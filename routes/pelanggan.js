var express = require('express');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();
var router = express.Router();
const multer  = require('multer')
const fs = require('fs');

const table = require('../models/TableData')

const path = require('path');
let upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `public/dataset/`);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
});

router.get('/api/pelanggan/:id?', async function(req, res) {
  var id = req.params.id
  //var sql = `select pelanggan.* from karyawan left join role on (karyawan.role = role.id) where karyawan.status =1`
  if(id == null){
    //var results = await table.Query(sql);
    var results = await table.All('pelanggan');
    return res.json({ data: results })
  }else{
    var results = await table.Find('pelanggan', {'id_pelanggan': id});
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

router.get('/data-pelanggan', async function(req, res) {
  res.render('pelanggan/pelanggan', {
    title: 'Data Pelanggan',
  });
});

router.post('/data-pelanggan-kasir', upload.single('foto'), async function(req, res) {
  var uid = req.session.passport.user.id_karyawan
  const {kode_pelanggan, nama_pelanggan, no_hp} = req.body;
  console.log(req.body)
  
  var data = {
    "kode_pelanggan": kode_pelanggan,
    "nama_pelanggan": nama_pelanggan,
    "no_hp": no_hp,
    "created_uid": uid,
  }

  console.log(req.body.foto !== undefined)

  if(req.body.foto !== undefined){
    const encoded = req.body.foto;
    const base64ToArray = encoded.split(";base64,");
    const extension = (base64ToArray[0]).replace(/^data:image\//, '');

    const imageData = base64ToArray[1];
    const fileName = kode_pelanggan + '.' + extension;
    
    const imagePath = path.join('public/dataset/') + fileName;
    fs.writeFileSync(imagePath, imageData,  { encoding: 'base64' });

    data['foto_pelanggan'] =  fileName
  }
  await table.Create("pelanggan", data)

  res.redirect('/kasir');
});

/*router.route('/data-pelanggan')
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
    res.render('data-pelanggan', {
      title: 'Data pelanggan',
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