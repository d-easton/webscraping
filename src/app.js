'use strict'

// NOTE: link this up with server.js

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const spotify = require('./route/spotifyLogin.route');
const scrape = require('./route/scraping.route');
const pitchfork = require('./scraping/pitchfork');
const xxl = require('./scraping/xxl');

const app = express();
app.use(cors());
app.use(express.static(__dirname + '/public')).use(cookieParser());;
app.use('/', spotify);
app.use('/scraping', scrape)

pitchfork.trackReviews();
pitchfork.rapAlbums();

xxl.yearlyReviews();
xxl.weeklyReviews();

app.listen(8888);