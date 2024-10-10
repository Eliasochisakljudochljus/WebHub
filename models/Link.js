// models/Link.js

const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Link = mongoose.model('Link', LinkSchema);

module.exports = Link;
