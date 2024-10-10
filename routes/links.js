// routes/links.js

const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

// Load Link Model
const Link = require('../models/Link');

// GET Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Link.find({ user: req.user.id })
    .sort({ order: 1 })
    .then(links => {
      res.render('dashboard', {
        user: req.user,
        links: links,
        title: "Dashboard"
      });
    });
});

// GET Add Link Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('addLink', { title: "Add Link" });
});

// POST Add Link
router.post('/add', ensureAuthenticated, (req, res) => {
  const { title, url } = req.body;
  let errors = [];

  if (!title || !url) {
    errors.push({ msg: 'Please enter both title and URL' });
  }

  if (errors.length > 0) {
    res.render('addLink', {
      errors,
      title,
      url
    });
  }
  else {
    const newLink = new Link({
      user: req.user.id,
      title,
      url
    });

    newLink.save()
      .then(link => {
        req.flash('success_msg', 'Link added successfully');
        res.redirect('/dashboard');
      })
      .catch(err => console.log(err));
  }
});

// GET Edit Link Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Link.findById(req.params.id)
    .then(link => {
      if (!link) {
        req.flash('error_msg', 'No link found');
        return res.redirect('/dashboard');
      }

      // Check if the link belongs to the user
      if (link.user.toString() !== req.user.id) {
        req.flash('error_msg', 'Not authorized');
        return res.redirect('/dashboard');
      }

      res.render('editLink', { link, title: "Edit link" });
      
    })
    .catch(err => {
      console.log(err);
      req.flash('error_msg', 'Error retrieving link');
      res.redirect('/dashboard');
    });
});

// PUT Update Link
router.put('/edit/:id', ensureAuthenticated, (req, res) => {
  Link.findById(req.params.id)
    .then(link => {
      if (!link) {
        req.flash('error_msg', 'No link found');
        return res.redirect('/dashboard');
      }

      // Check if the link belongs to the user
      if (link.user.toString() !== req.user.id) {
        req.flash('error_msg', 'Not authorized');
        return res.redirect('/dashboard');
      }

      // Update fields
      link.title = req.body.title;
      link.url = req.body.url;

      link.save()
        .then(updatedLink => {
          req.flash('success_msg', 'Link updated successfully');
          res.redirect('/dashboard');
        })
        .catch(err => {
          console.log(err);
          req.flash('error_msg', 'Error updating link');
          res.redirect('/dashboard');
        });
    })
    .catch(err => {
      console.log(err);
      req.flash('error_msg', 'Error retrieving link');
      res.redirect('/dashboard');
    });
});

// DELETE Link
router.delete('/delete/:id', ensureAuthenticated, (req, res) => {
  Link.findById(req.params.id)
    .then(link => {
      if (!link) {
        req.flash('error_msg', 'No link found');
        return res.redirect('/dashboard');
      }

      // Check if the link belongs to the user
      if (link.user.toString() !== req.user.id) {
        req.flash('error_msg', 'Not authorized');
        return res.redirect('/dashboard');
      }

      link.remove()
        .then(() => {
          req.flash('success_msg', 'Link removed');
          res.redirect('/dashboard');
        })
        .catch(err => {
          console.log(err);
          req.flash('error_msg', 'Error removing link');
          res.redirect('/dashboard');
        });
    })
    .catch(err => {
      console.log(err);
      req.flash('error_msg', 'Error retrieving link');
      res.redirect('/dashboard');
    });
});

module.exports = router;
