const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');
const express = require('express');
const http = require('http');
const fs = require('fs');

require('./funcs/state.js');

const app = express();
app.use(express.static(__dirname + '/public'));

// authorize app with spotify api
var client_id = '1345146f3b604b6fa7c691e0519bc2f0'; 
var redirect_uri = 'http://localhost:8888/login';

app.get('/login', function(req, res){
    console.log("got the log call");
    const stateKey = 'spotify_auth_state';
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


scrapePitchforkRapAlbums();
scrapePitchforkTracks();
scrapeSpotifyRapCaviar();


// basic server deploy
fs.readFile('./public/index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();
        console.log('Listening on 8888');  
    }).listen(8888);
});