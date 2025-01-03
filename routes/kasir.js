var express = require('express');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
//var db = require('../config/database');
const table = require('../models/TableData')
var ensureLoggedIn = ensureLogIn();

var router = express.Router();

//router.use(ensureLoggedIn)

/* GET home page. */
router.post('/api/pesanan', async function(req, res, next) {
  const {transaksi, id_pelanggan} = req.body;
   //console.log(data)
  // 1.create transaksi

  /*var transaksi = {
    "id_pelanggan": id_pelanggan,
    "subtotal": tanggal_mulai,
    "diskon": username,
    "total": hash,
    "id_program_loyalitas": salt,
    "created_uid": uid,
  }

  await table.Create("transaksi", transaksi)

  var detail = {
    "nama_karyawan": nama_karyawan,
    "tanggal_mulai": tanggal_mulai,
    "username": username,
    "hash": hash,
    "salt": salt,
    "role": role,
    "created_uid": uid,
  }

  await table.Create("transaksi_detail", detail)*/

  return res.json({ data: transaksi })
});

router.get('/kasir/:id?', async function(req, res) {
  var id = req.params.id

  var menu_kategori = await table.All('menu_kategori')
  var pelanggan = null
  if(id){
    pelanggan = await table.Find('pelanggan', {id_pelanggan: id})
  }
  console.log(pelanggan)
  res.render('kasir/kasir', {
    title: 'Kasir Register',
    layout: 'layouts/kasir',
    menu_kategori: menu_kategori,
    id: id,
    pelanggan: pelanggan,
  });
});

module.exports = router;