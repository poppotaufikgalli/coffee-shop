var express = require('express');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const _ = require('lodash')
const table = require('../models/TableData')
var ensureLoggedIn = ensureLogIn();

var router = express.Router();

//router.use(ensureLoggedIn)

/* GET home page. */
router.post('/api/pesanan', async function(req, res, next) {
  var uid = req.session.passport.user.id_karyawan
  const {transaksi, id_pelanggan, klasifikasi, diskon} = req.body;
   //console.log(data)
  // 1.create transaksi

  var subtotal = _.sumBy(transaksi, function(o){
    return o.total *1
  })
  //console.log(total)
  var ndiskon = Math.round(subtotal * (diskon/100))
  var ntotal = subtotal - ndiskon

  var dtTransaksi = {
    "id_pelanggan": id_pelanggan,
    "subtotal": subtotal,
    "diskon": ndiskon,
    "total": ntotal,
    "id_program_loyalitas": klasifikasi,
    "created_uid": uid,
    "created_at": new Date(),
  }

  var result = await table.Create("transaksi", dtTransaksi)
  //console.log(result)
  
  var detail = []

  for (var i = 0; i < transaksi.length; i++) {
    detail.push({
      "id_transaksi" : result.insertId,
      "id_menu": transaksi[i].id,
      "jml": transaksi[i].jumlah,
      "total": transaksi[i].total,
      "created_uid": uid,  
    })
  }

  await table.BulkInsert("transaksi_detail", detail)

  return res.json({ 
    insertId: result.insertId, 
    transaksi: transaksi,
    dtTransaksi: dtTransaksi,
  })
});

router.get('/kasir/:id?', async function(req, res) {
  var id = req.params.id

  var menu_kategori = await table.All('menu_kategori')
  var pelanggan = null
  if(id){
    //var now = new Date().toLocaleString()
    //console.log(now)
    var todayDate = new Date().toISOString().slice(0, 10);
    //var now = '2025-01-05'
    var sql = `SELECT a.*, coalesce(b.diskon, 0) as diskon, coalesce(b.keterangan, "") as keterangan FROM pelanggan a left join loyalitas b on (a.klasifikasi = b.id_loyalitas and b.priode_awal <= '${todayDate}' and b.priode_akhir >= '${todayDate}') where a.id_pelanggan = ${id}`
    console.log(sql)
    var a = await table.Query(sql)
    pelanggan = a[0]
    console.log(pelanggan)
    //pelanggan = await table.Find('pelanggan', {id_pelanggan: id})
  }
  //console.log(pelanggan)
  res.render('kasir/kasir', {
    title: 'Kasir Register',
    layout: 'layouts/kasir',
    menu_kategori: menu_kategori,
    id: id,
    pelanggan: pelanggan,
  });
});

module.exports = router;