const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');
const express = require('express');
const http = require('http');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

//import { generateRandomString} from './funcs/state.js';

const app = express();
app.use(express.static(__dirname + '/public')).use(cookieParser());;

// authorize app with spotify api
const client_id = '1345146f3b604b6fa7c691e0519bc2f0'; 
const redirect_uri = 'http://localhost:8888/processLogin';
const client_secret ='';

// for storing login info into cookie dictionary via cookie-parser
const stateKey = 'spotify_auth_state';

app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    // your application requests authorization
    const scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    }));
});

app.get('/processLogin', (req, res) => {

    // state management, based off Spotify's auth recommendations
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;
    console.log("code: " +code);
    console.log("state: " +state);
    console.log("storedState: " +storedState);
    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
            error: 'state_mismatch'
        }));
    } 
    else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const access_token = body.access_token, refresh_token = body.refresh_token;

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // Test api connect by querying for logged in user's data
                request.get(options, function(error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                }));
            }
            else {
                res.redirect('/#' +
                querystring.stringify({
                    error: 'invalid_token'
                }));
            }
        });
    }
});

// scrape rapcaviar test if it works with spotify playlists
const scrapeSpotifyRapCaviar = () => {
    const targetUrl = "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd";
    request(targetUrl, (err, res, body) =>{
        const $ = cheerio.load(body);
        let results = [];
        $('.name').each((i, elem) => {
            console.log("iterate on name");
            results[i] = {};
            results[i]['track'] = $(elem).find('.tracklist-name').text();
            results[i]['artist'] = $(elem).find('.tracklist-row__artist-name-link').text();
            results[i]['album'] = $(elem).find('.tracklist-row__album-name-link').text();
        });
        console.log(results);
    });
}

/**
 * Scrape PitchFork album reviews for Rap genre
 * Return [] conainting artist, album info for 12 most recently reviews
 */
const scrapePitchforkRapAlbums = () => {
    const targetUrl = "https://pitchfork.com/reviews/albums/?genre=rap&page=1";
    request(targetUrl, (err, res, body) =>{
        const $ = cheerio.load(body);
        let results = [];
        $('.review').each((i, elem) => {
            results[i] = {};
            results[i]['artist'] = $(elem).find('.review__title-artist li').text();
            results[i]['album'] = $(elem).find('.review__title-album').text();
        });
        console.log(results);
        return results;
    });
}

/**
 * Scrape PitchFork track
 * Return [] conainting artist, track, genre info for ?? most recently reviews
 */
const scrapePitchforkTracks = () => {
    const targetUrl = "https://pitchfork.com/reviews/tracks/?page=1";
    request(targetUrl, (err, res, body) =>{
        const $ = cheerio.load(body);
        let results = [];
        $('.track-collection-item').each((i, elem) => {
            let genre = $(elem).find('.genre-list__link').text().toLowerCase();
            let genreMatch = checkGenre(genre);
            if( genreMatch ){
                let newTrack = {};
                newTrack['artist'] = $(elem).find('.track-collection-item__track-link li').text();
                newTrack['track'] = $(elem).find('.track-collection-item__title').text();
                newTrack['genre'] = genre;
                results.push(newTrack);
            }
        });
        console.log(results);
        return results;
    });
}

/**
 * Checks if a given genre matches the 
 * @param {String} genreString - all genres associated with this track, concatonated into one string
 */
const checkGenre = (genreString) => {
    let genreFilter = ["rap", "r&b", "hiphop"];
    let foundMatch = false;
    genreFilter.forEach((item)=>{
        if ( genreString.includes(item) ){
            foundMatch = true;
        }
    });
    return foundMatch;
} 

/**
 * Generates random string w/ numbers and letters -- here for now but should move to support doc
 * @param  {number} length of string to generate
 * @return {string} string with randomized letters and numbers
 */
const generateRandomString = function(length) {
    let buildRandomString = '';
    const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        buildRandomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }
    return buildRandomString;
};


scrapePitchforkRapAlbums();
scrapePitchforkTracks();
scrapeSpotifyRapCaviar();

app.listen(8888);