const express = require('express');
const app = express() 
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Link = require('../models/Link')

// Home Page
router.get('/', async (req, res) => {
  try {
    const links = await Link.find({}); // Fetch the links
    res.render('index', { title: "Home", user: req.user, links: links });
  } catch (err) {
    console.error(err);
  }
});


// Dashboard Redirect
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.redirect('/links/dashboard');
});

module.exports = router;
