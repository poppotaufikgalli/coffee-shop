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

router.post('/api/kunjungan', async function(req, res) {
  //console.log(req.body)
  const {awal, akhir} = req.body
  var sql = `select a.id_pelanggan, b.nama_pelanggan, sum(a.total) as total_transaksi, count(a.id) as total_kunjungan from transaksi a join pelanggan b on (a.id_pelanggan = b.id_pelanggan) where DATE_FORMAT(a.created_at, '%Y-%m-%d') between '${awal}' and '${akhir}' group by a.id_pelanggan order by total_kunjungan asc, total_transaksi asc`
  var results = await table.Query(sql);

  /*const results = [
    { nama_pelanggan: "Joko", total_kunjungan: 4, total_transaksi: 120000 },
    { nama_pelanggan: "Andi", total_kunjungan: 2, total_transaksi: 60000 },
    { nama_pelanggan: "Indra", total_kunjungan: 3, total_transaksi: 90000 },
    { nama_pelanggan: "Ayu", total_kunjungan: 5, total_transaksi: 150000 },
    { nama_pelanggan: "Adi", total_kunjungan: 2, total_transaksi: 50000 },
    { nama_pelanggan: "Ira", total_kunjungan: 2, total_transaksi: 70000 },
    { nama_pelanggan: "Tole", total_kunjungan: 1, total_transaksi: 20000 },
  ];*/

  const kunjungan = results.map((d) => d.total_kunjungan);
  const totalPembelian = results.map((d) => d.total_transaksi);

  const Q1Kunjungan = hitungKuartil(kunjungan, 1);
  const Q2Kunjungan = hitungKuartil(kunjungan, 2);
  const Q3Kunjungan = hitungKuartil(kunjungan, 3);

  const Q1Pembelian = hitungKuartil(totalPembelian, 1);
  const Q2Pembelian = hitungKuartil(totalPembelian, 2);
  const Q3Pembelian = hitungKuartil(totalPembelian, 3);

  //console.log(Q1Kunjungan, Q1Pembelian)

  const ruleSet = {
    "Pelanggan Baru": {
      kunjungan: { min: 0, max: Q1Kunjungan },
      totalPembelian: { min: Math.min(...totalPembelian), max: Q1Pembelian },
    },
    "Pelanggan Tetap": {
      kunjungan: { min: Q1Kunjungan, max: Q2Kunjungan },
      totalPembelian: { min: Q1Pembelian, max: Q2Pembelian },
    },
    "Pelanggan Loyal": {
      kunjungan: { min: Q2Kunjungan, max: Q3Kunjungan },
      totalPembelian: { min: Q2Pembelian, max: Q3Pembelian },
    },
    "Pelanggan Sangat Loyal": {
      kunjungan: { min: Q3Kunjungan, max: Math.max(...kunjungan) },
      totalPembelian: { min: Q3Pembelian, max: Math.max(...totalPembelian) },
    },
  };

  console.log(ruleSet)
  //console.log(1 >= 1 && 1 <= 0 )
  //console.log(10000 >= 10000 && 10000 <= 19999)

  const hasilKlasifikasi = results.map((pelanggan) => ({
    ...pelanggan,
    kategori: klasifikasikanPelanggan(pelanggan, ruleSet),
  }));

  /*var data = [] 
  //console.log(results)
  var q1 = 1/4*(results.length +1)-1
  var q2 = 2/4*(results.length +1)-1
  var q3 = 3/4*(results.length +1)-1
  //console.log(q1, q2, q3)
  console.log(results[q2])

  var test = _.map(results, function(i, k){
    if(i.total_kunjungan > results[q3].total_kunjungan && i.total_transaksi > results[q3].total_transaksi){
      i.kategori = "Konsumen Sangat Loyal"
    }else if(i.total_kunjungan > results[q2].total_kunjungan && i.total_kunjungan <= results[q3].total_kunjungan && i.total_transaksi > results[q2].total_transaksi && i.total_transaksi <= results[q3].total_transaksi){
      i.kategori = "Konsumen Loyal"
    }else if(i.total_kunjungan > results[q1].total_kunjungan && i.total_kunjungan <= results[q2].total_kunjungan && i.total_transaksi > results[q1].total_transaksi && i.total_transaksi <= results[q2].total_transaksi){
      i.kategori = "Konsumen Tetap"
    }else if(i.total_kunjungan <= results[q1].total_kunjungan && i.total_transaksi <= results[q1].total_transaksi){
      i.kategori = "Konsumen Baru"
    }else{
      i.kategori = "-"
    }

    return i
  })

  console.log(test)*/

  return res.json({ data: hasilKlasifikasi, awal: awal, akhir: akhir })
});

router.get('/form-loyalitas/:id?', async function(req, res) {
  var id = req.params.id
  res.render('loyalitas/form', {
    title: 'Form Program Loyalitas',
    id: id,
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

/*function klasifikasikanPelanggan(pelanggan, ruleSet) {
  for (const [kategori, aturan] of Object.entries(ruleSet)) {
    if (
      pelanggan.total_kunjungan >= aturan.kunjungan.min &&
      pelanggan.total_kunjungan <= aturan.kunjungan.max &&
      pelanggan.total_transaksi >= aturan.totalPembelian.min &&
      pelanggan.total_transaksi <= aturan.totalPembelian.max
    ) {
      return kategori;
    }
  }
  return "Tidak Terklasifikasi";
}*/

function klasifikasikanPelanggan(pelanggan, ruleSet) {
  const kategori = Object.keys(ruleSet).find((key) => {
    const rule = ruleSet[key];
    return (
      pelanggan.total_kunjungan >= rule.kunjungan.min &&
      pelanggan.total_kunjungan <= rule.kunjungan.max &&
      pelanggan.total_transaksi >= rule.totalPembelian.min &&
      pelanggan.total_transaksi <= rule.totalPembelian.max
    );
  });

  // Jika tidak ada kategori yang cocok, anggap sebagai "Pelanggan Baru"
  return kategori || "Pelanggan Baru";
}



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