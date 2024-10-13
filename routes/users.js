const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const Link = require('../models/Link');
// Load User Model
const User = require('../models/User');
const { ensureAuthenticated } = require('../middleware/auth');
const links = Link.find({}); // Fetch all links from the database

// GET Register Page
router.get('/register', (req, res) => res.render('register', { title: 'Register', links }));

// POST Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  // Check password length
  if (password.length < 8) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  }
  else {
    // Validation Passed
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          // User Exists
          errors.push({ msg: 'Email is already registered' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        }
        else {
          const newUser = new User({
            name,
            email,
            password
          });

          // Hash Password
          bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // Set password to hashed
              newUser.password = hash;
              // Save user
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
  }
});

// GET Login Page
router.get('/login', (req, res) => res.render('login', { title: "Login", links }));

// POST Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// GET Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) { return next(err); }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  });
});

module.exports = router;
