const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

// Passport Config
require('./config/passport')(passport);

//JSON requst
app.use(express.json())

// DB Config
const DBURI = process.env.DBURI;

// Connect to MongoDB
mongoose
  .connect(DBURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.set('layout', 'layouts/layout');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Method Override for PUT and DELETE methods
app.use(methodOverride('_method'));

// Express Session
app.use(session({
  secret: 'secret', // Change this to a secure secret in production
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// After other middleware

// Make user available in all templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Connect Flash
app.use(flash());

// Global Variables for Flash Messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/links', require('./routes/links'));

const PORT = process.env.PORT

app.listen(PORT, console.log(`Server started on http://localhost:${PORT}`));
