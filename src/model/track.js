'use strict'

const trackSchema = mongoose.Schema({
    title: { type: String, required: true },
    album: { type: String, required: true },
    artists: { type: [String], required: true },
    genre: { type: String, required: true, default : "rap"},
    published: { type: Date },
    firstDocumented: { type: Date, required: true, default : () => new Date()},
  });

  const Track = module.exports = mongoose.model('track', trackSchema);