const passport = require("passport");
const User = require('../models/User');
const bcrypt = require('bcryptjs')

const registerUser = (req, res) => {
  const { name, email, location, password, confirm } = req.body;

  if (!name || !email || !password || !confirm) {
    console.log("Fill empty fields");
  }

  //Confirm Passwords
  if (password !== confirm) {
    console.log("Password must match");
  } 
  else {
    //Validation
    User.findOne({ email: email }).then((user) => {
      if (user) {
        console.log("email exists");
        res.render("register", {
          name,
          email,
          password,
          confirm,
        });
      } else {
        //Validation
        const newUser = new User({
          name,
          email,
          location,
          password,
        });
        //Password Hashing
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then(res.redirect("/login"))
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
};


//For register page
/*const registerView = (req, res) => {
    res.render("register", { 
  });
}*/

const loginUser = (req, res, next) => {
  if (!req.body) return res.sendStatus(400)
  const {username, password} = req.body

  if(!username || !password){
    console.log('Please fill in all the fields')
    ///res.render('login', {email, password})
    res.redirect('/login');
  }else {
    console.log("this passport authenticate")
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      //failureMessage: true,
      //failureFlash: true 
    })
  }
}

//For views
const loginView = (req, res) => {
  res.render("login", {
    title: 'Login',
    layout: 'layouts/login',
  });
}

const logoutUser = (req, res, next) => {
  req.logout(function(err){
    if (err) { return next(err); }
    res.redirect('/login');
  });
}

const homeView = (req, res) => {
  res.render("home", {
    title: 'Dashboard'
  })
}

module.exports= {
  //registerView,
  loginView,
  registerUser,
  loginUser,
  homeView,
  logoutUser
};