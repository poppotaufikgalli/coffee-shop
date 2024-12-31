//js
const crypto = require('crypto');
var LocalStrategy = require("passport-local");
const db = require('../config/database')

const loginCheck = passport => {

  passport.use(    
    new LocalStrategy(function verify(username, password, cb) {
      db.query('SELECT * FROM users WHERE username = ?', [ username ], function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
        
        crypto.pbkdf2(password, user.salt, 10000, 512, 'sha512', function(err, hashedPassword) {
          if (err) { return cb(err); }
          if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
            return cb(null, false, { message: 'Incorrect username or password.' });
          }
          return cb(null, user);
        });
      });
    })
  )
    
  passport.serializeUser(function(karyawan, done) {
    process.nextTick(function() {
      done(null, {
        id: karyawan.id,
        username: karyawan.username,
        photo: karyawan.photo
      });
    });
  });

  passport.deserializeUser(function(karyawan, done) {
    process.nextTick(function() {
      return cb(null, karyawan);
    });
  });
};

module.exports = {
  loginCheck,
};