const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy ;

const User = require('../models/user');
router.get('/register', (req,res) => {
    res.render('register');
});

router.get('/login',(req,res) => {
    res.render('login')
});

router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
});

router.post('/register',(req,res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let userName = req.body.userName;
    let email = req.body.email;
    let password = req.body.password
    let confirmPassword = req.body.confirmPassword;

    req.checkBody('firstName', 'FirstName is required').notEmpty();
    req.checkBody('lastName', 'LastName is required').notEmpty();
    req.checkBody('userName', `UserName can't be empty`).notEmpty();
    req.checkBody('email', `email can't be empty`).notEmpty();
    req.checkBody('email', 'In Valid Email').isEmail();
    req.checkBody('password', `Password can't be empty`).notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors : errors
        });
    }
    else {
        let newUser = new User({
            firstName :firstName,
            lastName :lastName,
            userName : userName,
            email : email,
            password : password
        });
        User.createUser(newUser, (err, user) => {
            if(err) throw err;
            console.log(user);
        });
        req.flash('success_msg', 'You are successfully registered');
        res.redirect('/users/login');
    }
    
})

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.getUserByUsername(username, (err, user) => {
          if(err) throw err;
          if(!user){
              return done(null, false, {message: 'Unknown User'});
          }
       User.comparePassword(password, user.password, (err, isMatch) => {
           if(err) throw err;
           if(isMatch){
               return done(null, user);
           }else {
               return done(null, false, {message: 'Invalid password'});
           }
       });
      });
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.getUserById(id, (err,user) => {
        done(err, user);
    });
  })
  

  router.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
  function (req, res) {
      res.redirect('/');
  });



module.exports = router;