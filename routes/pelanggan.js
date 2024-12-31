var express = require('express');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();
var router = express.Router();
var db = require('../config/database');

async function getData(id = null){
  if(id == null){
    db.query('SELECT * FROM pelanggan', function(err, results) {
        if (err) { 
          return {
            'ok' : false,
          }; 
        }
        if (!results || results.length  == 0) {
          return {
            'ok' : false,
          }; 
        }
        console.log(results)
        return {
          'ok' : true,
          'data': results
        }
    });
  }else{
    db.query('SELECT * FROM pelanggan where id', [id], function(err, results) {
        if (err) { 
          return {
            'ok' : false,
          }; 
        }
        if (!results || results.length  == 0) {
          return {
            'ok' : false,
          }; 
        }
        
        return {
          'ok' : true,
          'data': results[0]
        }
    });
  }
}

router.get('/data-pelanggan', async function(req, res) {
  db.query('SELECT * FROM pelanggan', function(err, results) {
      if (err) { 
        return res.status(504);
      }
     
      res.render('pelanggan/pelanggan', {
        title: 'Data Pelanggan',
        data: results,
      });
  });
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