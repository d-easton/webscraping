'use strict'

const express = require('express');
const scrapingRouter = new express.Router();

const pitchfork = require('../scraping/pitchfork');
const xxl = require('../scraping/xxl');

scrapingRouter.get('/albums', (req, res) => {
    let accumulate = {};
    const albums = pitchfork['rapAlbums'];
    albums.array.forEach(element => {
      if ( !(element['album'] in accumulate) ){
        accumulate[element['album']] = element['artist']
      }
    });
    res.send(accumulate);
});

// scrapingRouter.get('/xxl', (req, res) => {
    
// });

module.exports = scrapingRouter;
