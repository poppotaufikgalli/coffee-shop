var express = require('express');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var db = require('../config/database');
var ensureLoggedIn = ensureLogIn();

var router = express.Router();

router.use(ensureLoggedIn)
/* GET home page. */
router.get(['/', '/dashboard'], function(req, res, next) {
  return res.render('dashboard', {
    title: 'Dashboard'
  }); 
});

router.route('/kasir')
  .get(function (req, res) {
    db.query('SELECT * FROM menu', function(err, results) {
        /*if (err) { 
          return res.json({ ok: false, data: [] })
        }
        if (!results || results.length == 0) {
          return res.json({ ok: false, data: [] })
        }*/
        
        res.render('kasir/kasir', {
          title: 'Kas Register',
          layout: 'layouts/kasir',
          data: results
        });
    });

    
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  });

module.exports = router;