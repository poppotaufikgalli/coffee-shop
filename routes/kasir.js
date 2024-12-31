var express = require('express');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

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
    res.render('kasir/kasir', {
      title: 'Kas Register',
      layout: 'layouts/kasir',
    });
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  });

module.exports = router;