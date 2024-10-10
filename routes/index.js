// routes/index.js

const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

// Home Page
router.get('/', (req, res) => res.render('index', { title: 'Home' }));

// Dashboard Redirect
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.redirect('/links/dashboard');
});

module.exports = router;
