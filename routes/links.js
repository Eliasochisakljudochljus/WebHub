// routes/links.js

const express = require('express');
const app = express();
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const methodOverride = require('method-override');

// Load Link Model
const Link = require('../models/Link');

const links = Link.find({}); // Fetch all links from the database

app.use(methodOverride('_method'));

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
  res.render('addLink', { title: "Add Link", links });
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

      res.render('editLink', { link, title: "Edit link", links });
      
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

// DELETE Link Route
router.delete('/delete/:id', ensureAuthenticated, (req, res) => {
  console.log(`Attempting to delete link with ID: ${req.params.id}`);

  Link.findById(req.params.id)
      .then(link => {
          if (!link) {
              console.log('No link found');
              req.flash('error_msg', 'No link found');
              return res.redirect('/dashboard');
          }

          // Check if the link belongs to the user
          if (link.user.toString() !== req.user.id) {
              console.log('User not authorized to delete this link');
              req.flash('error_msg', 'Not authorized');
              return res.redirect('/dashboard');
          }

          // Instead of link.remove(), use Link.findByIdAndRemove
          Link.findOneAndDelete(req.params.id)
              .then(() => {
                  console.log('Link deleted successfully');
                  req.flash('success_msg', 'Link removed');
                  res.redirect('/dashboard'); // Redirect to the dashboard after successful deletion
              })
              .catch(err => {
                  console.log('Error removing link:', err);
                  req.flash('error_msg', 'Error removing link');
                  res.redirect('/dashboard');
              });
      })
      .catch(err => {
          console.log('Error retrieving link:', err);
          req.flash('error_msg', 'Error retrieving link');
          res.redirect('/dashboard');
      });
});

module.exports = router;
