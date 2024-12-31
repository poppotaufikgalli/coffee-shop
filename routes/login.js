var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var db = require('../config/database');

/* Configure password authentication strategy.
 *
 * The `LocalStrategy` authenticates users by verifying a username and password.
 * The strategy parses the username and password from the request and calls the
 * `verify` function.
 *
 * The `verify` function queries the database for the user record and verifies
 * the password by hashing the password supplied by the user and comparing it to
 * the hashed password stored in the database.  If the comparison succeeds, the
 * user is authenticated; otherwise, not.
 */
passport.use(new LocalStrategy(function verify(username, password, cb) {
    db.query('SELECT * FROM karyawan WHERE username = ?', [ username ], function(err, result) {
        if (err) { return cb(err); }
        if (!result || result.length  == 0) { 
          return cb(null, false, { message: 'Incorrect username or password.' }); 
        }

        const user = result[0]
        
        crypto.pbkdf2(password, user.salt, 10000, 512, 'sha512', function(err, hashedPassword) {
            if (err) { return cb(err); }
            if (user.hash.toString() !== hashedPassword.toString('hex')) {
              return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, user);
        });
    });
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, user);
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


var router = express.Router();

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Login',
    layout: 'layouts/login',
  });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }), function(req, res) {
  res.redirect('/');
});

/* POST /logout
 *
 * This route logs the user out.
 */
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

module.exports = router;