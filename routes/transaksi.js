var express = require('express');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();
var router = express.Router();
const table = require('../models/TableData')

router.get('/api/transaksi/:id?', async function(req, res) {
  var id = req.params.id
  var sql = `select transaksi.*, pelanggan.nama_pelanggan as nama_pelanggan, loyalitas.klasifikasi as nama_klasifikasi, loyalitas.priode_awal as priode_awal, loyalitas.priode_akhir as priode_akhir from transaksi left join pelanggan on (transaksi.id_pelanggan = pelanggan.id_pelanggan) left join loyalitas on (transaksi.id_program_loyalitas = loyalitas.id_loyalitas)`
  if(id == null){
    var results = await table.Query(sql);
    //var results = await table.All('transaksi');
    return res.json({ data: results })
  }else{
    var results = await table.Find('transaksi', {'id': id});
    return res.json({ data: results })
  }
});

router.get('/data-transaksi', async function(req, res) {
  res.render('transaksi/transaksi', {
    title: 'Data Transaksi',
  });
});

/*router.route('/data-transaksi')
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
    res.render('data-transaksi', {
      title: 'Data transaksi',
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