var express = require('express');
const _ = require('lodash')
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
  //var sql = `select loyalitas_kategori.*, loyalitas.* from loyalitas_kategori left join loyalitas on (loya.role = role.id) where karyawan.status =1`
  if(id == null){
    //var results = await table.Query(sql);
    var results = await table.All('loyalitas');
    return res.json({ data: results })
  }else{
    var results = await table.Find('loyalitas', {'id_loyalitas': id});
    return res.json({ data: results })
  }
});

router.post('/api/simpan-klasifikasi', async function(req, res) {
  var uid = req.session.passport.user.id_karyawan
  const {data} = req.body
  
  //console.log(results)

  for (var i = data.length - 1; i >= 0; i--) {
    //console.log(results[i])
    var keys = {"id_pelanggan" : data[i].id_pelanggan *1}

    var klasifikasi = 0

    if(data[i].kategori == "Pelanggan Sangat Loyal"){
      klasifikasi = 1;
    }else if(data[i].kategori == "Pelanggan Loyal"){
      klasifikasi = 2;
    }else if(data[i].kategori == "Pelanggan Tetap"){
      klasifikasi = 3;
    }

    var udata = {
      "klasifikasi": klasifikasi,
      "updated_uid": uid,
    }
    console.log(udata, keys)
    await table.Update("pelanggan", udata, keys)
  }
  //console.log(req.body)
  return res.json({ data: data })
});

router.post('/api/kunjungan', async function(req, res) {
  //console.log(req.body)
  const {awal, akhir} = req.body
  var sql = `select a.id_pelanggan, b.nama_pelanggan, sum(a.total) as total_transaksi, count(a.id) as total_kunjungan from transaksi a join pelanggan b on (a.id_pelanggan = b.id_pelanggan) where DATE_FORMAT(a.created_at, '%Y-%m-%d') between '${awal}' and '${akhir}' group by a.id_pelanggan order by total_kunjungan asc, total_transaksi asc`
  var results = await table.Query(sql);

  const kunjungan = results.map((d) => d.total_kunjungan);
  const totalPembelian = results.map((d) => d.total_transaksi);

  const Q1Kunjungan = hitungKuartil(kunjungan, 1);
  const Q2Kunjungan = hitungKuartil(kunjungan, 2);
  const Q3Kunjungan = hitungKuartil(kunjungan, 3);

  const Q1Pembelian = hitungKuartil(totalPembelian, 1);
  const Q2Pembelian = hitungKuartil(totalPembelian, 2);
  const Q3Pembelian = hitungKuartil(totalPembelian, 3);

  const ruleSet = {
    "Pelanggan Sangat Loyal": {
      id: 1,
      kunjungan: { min: Q3Kunjungan, max: Math.max(...kunjungan) },
      totalPembelian: { min: Q3Pembelian, max: Math.max(...totalPembelian) },
    },
    "Pelanggan Loyal": {
      id: 2,
      kunjungan: { min: Q2Kunjungan, max: Q3Kunjungan },
      totalPembelian: { min: Q2Pembelian, max: Q3Pembelian },
    },
    "Pelanggan Tetap": {
      id: 3,
      kunjungan: { min: Q1Kunjungan, max: Q2Kunjungan },
      totalPembelian: { min: Q1Pembelian, max: Q2Pembelian },
    },
    "Pelanggan Baru": {
      id: 4,
      kunjungan: { min: 0, max: Q1Kunjungan },
      totalPembelian: { min: Math.min(...totalPembelian), max: Q1Pembelian },
    },
  };

  //console.log(ruleSet)

  const hasilKlasifikasi = results.map((pelanggan) => ({
    ...pelanggan,
    kategori: klasifikasikanPelanggan(pelanggan, ruleSet),
  }));

  //console.log(hasilKlasifikasi)

  const klasifikasi = _.map(_.groupBy(hasilKlasifikasi, 'kategori'), function(value, key){
    //console.log(value)
    var id = _.map(value, 'id_pelanggan')
    var nama = _.map(value, 'nama_pelanggan')
    return {
      id : ruleSet[key].id,
      kategori: key, 
      id_pelanggan: id, 
      nama_pelanggan : nama 
    };
  })

  //console.log(klasifikasi)

  return res.json({ data: hasilKlasifikasi, awal: awal, akhir: akhir })
});

router.get('/form-loyalitas/:id?', async function(req, res) {
  var id = req.params.id
  res.render('loyalitas/form-edit', {
    title: 'Form Program Loyalitas',
    id: id,
  });
});

router.get('/cari-pelanggan-loyalitas', async function(req, res) {
  res.render('loyalitas/form', {
    title: 'Cari Pelanggan Loyalitas',
  });
});

// Fungsi untuk menghitung kuartil
function hitungKuartil(data, kuartil) {
  data.sort((a, b) => a - b);
  const n = data.length;
  const posisi = (kuartil / 4) * (n + 1) - 1;
  if (Number.isInteger(posisi)) {
    return data[posisi];
  }
  const posBawah = Math.floor(posisi);
  const posAtas = Math.ceil(posisi);
  return (
    data[posBawah] + (data[posAtas] - data[posBawah]) * (posisi - posBawah)
  );
}

function klasifikasikanPelanggan(pelanggan, ruleSet) {
  if (
    pelanggan.total_kunjungan >= ruleSet["Pelanggan Sangat Loyal"].kunjungan.min &&
    pelanggan.total_kunjungan <= ruleSet["Pelanggan Sangat Loyal"].kunjungan.max &&
    pelanggan.total_transaksi >= ruleSet["Pelanggan Sangat Loyal"].totalPembelian.min &&
    pelanggan.total_transaksi <= ruleSet["Pelanggan Sangat Loyal"].totalPembelian.max
  ) {
    return "Pelanggan Sangat Loyal";
  }
  if (
    pelanggan.total_kunjungan >= ruleSet["Pelanggan Loyal"].kunjungan.min &&
    pelanggan.total_kunjungan <= ruleSet["Pelanggan Loyal"].kunjungan.max &&
    pelanggan.total_transaksi >= ruleSet["Pelanggan Loyal"].totalPembelian.min &&
    pelanggan.total_transaksi <= ruleSet["Pelanggan Loyal"].totalPembelian.max
  ) {
    return "Pelanggan Loyal";
  }
  if (
    pelanggan.total_kunjungan >= ruleSet["Pelanggan Tetap"].kunjungan.min &&
    pelanggan.total_kunjungan <= ruleSet["Pelanggan Tetap"].kunjungan.max &&
    pelanggan.total_transaksi >= ruleSet["Pelanggan Tetap"].totalPembelian.min &&
    pelanggan.total_transaksi <= ruleSet["Pelanggan Tetap"].totalPembelian.max
  ) {
    return "Pelanggan Tetap";
  }
  return "Pelanggan Baru";
}

router.post('/data-loyalitas/:id?', async function(req, res) {
  var id = req.params.id
  var uid = req.session.passport.user.id_karyawan
  const {priode_awal, priode_akhir, diskon, keterangan} = req.body;
  
  var keys = {'id_loyalitas': id}
  var data = {
    "priode_awal": priode_awal,
    "priode_akhir": priode_akhir,
    "diskon": diskon,
    "keterangan": keterangan,
    "updated_uid": uid,
  }

  await table.Update("loyalitas", data, keys)

  res.redirect('/program-loyalitas');
});

/*router.post('/api/delete-karyawan',async function(req, res){
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