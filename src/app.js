'use strict'

// NOTE: link this up with server.js

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// scripts
const spotify = require('./route/spotifyLogin.route');
const scrape = require('./route/scraping.route');
const pitchfork = require('./scraping/pitchfork');
const xxl = require('./scraping/xxl');

// DB work
const pitchforkDB = require('./database/pitchfork/addTrack');

const app = express();
app.use(cors());
app.use(express.static(__dirname + '/public')).use(cookieParser());;
app.use('/', spotify);
app.use('/scraping', scrape)

const trackReviews = pitchfork.trackReviews();
console.log("TRACK REVIEWS::");
console.log(typeof(trackReviews));
console.log(trackReviews);
// pitchforkDB.insert
// .catch(console.dir);



// pitchfork.rapAlbums();

// xxl.yearlyReviews();
// xxl.weeklyReviews();

app.listen(8888);