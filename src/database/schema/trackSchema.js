const mongoose = require('mongoose')

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Track title is required']
  },
  artists: {
    type: Array,
    required: [true, 'A track requires at least one artist']
  },
  published: {
    type: Date,
  },
  scraped: {
    type: Date,
    required: [true, 'Date of initial scrape is required']
  },
  genre: {
      type: String,
  }
});

module.exports = trackSchema