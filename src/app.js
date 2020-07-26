'use strict'

const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');
const express = require('express');
const http = require('http');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const spotify = require('./route/spotifyLogin.route');

const app = express();
app.use(express.static(__dirname + '/public')).use(cookieParser());;
app.use('/', spotify);

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
const generateRandomString = (length) => {
    let buildRandomString = '';
    const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        buildRandomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }
    return buildRandomString;
}

scrapePitchforkRapAlbums();
scrapePitchforkTracks();

app.listen(8888);