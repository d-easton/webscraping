'use strict'
const cheerio = require('cheerio');
const request = require('request-promise');

const funcs = require('../support/funcs');

/**
 * Scrape PitchFork track
 * Return [] conainting artist, track, genre info for ?? most recently reviews
 */
const scrapePitchforkTracks = async () => {
     
    const options = {
        uri: "https://pitchfork.com/reviews/tracks/?page=1",
        transform: (body) => {
            return cheerio.load(body);
        }
    };

    try{
        const $ = await request(options);
        $('.track-collection-item').each((i, elem) => {
            let genre = $(elem).find('.genre-list__link').text().toLowerCase();
            let genreMatch = funcs.checkGenre(genre);
            if( genreMatch ){
                let newTrack = {};
                newTrack['artist'] = await $(elem).find('.track-collection-item__track-link li').text();
                newTrack['track'] = await $(elem).find('.track-collection-item__title').text();
                newTrack['genre'] = genre;
                results.push(newTrack);
            }
        });
        console.log("bro what");
        console.log(results);
        return results;
    }
    catch (err) {
        console.log("eek");
        console.log(err);
    }

    // const targetUrl = "https://pitchfork.com/reviews/tracks/?page=1";
    // try {
    //     request(targetUrl, (err, res, body) => {
    //         const $ = cheerio.load(body);
    //         let results = [];
    //         $('.track-collection-item').each((i, elem) => {
    //             let genre = $(elem).find('.genre-list__link').text().toLowerCase();
    //             let genreMatch = funcs.checkGenre(genre);
    //             if( genreMatch ){
    //                 let newTrack = {};
    //                 newTrack['artist'] = $(elem).find('.track-collection-item__track-link li').text();
    //                 newTrack['track'] = $(elem).find('.track-collection-item__title').text();
    //                 newTrack['genre'] = genre;
    //                 results.push(newTrack);
    //             }
    //         });
    //         return results;
    //         // console.log(results);
    //         // output.push.
    //     });
    // }
    // catch (err) {
    //     console.log("eek");
    //     console.log("error");
    // }
    // //return output;
}

const pitchforkTracks = async () => {
    return await scrapePitchforkTracks();
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

const pitchforkScrape = {
    'trackReviews': scrapePitchforkTracks,
    'rapAlbums': scrapePitchforkRapAlbums
}

module.exports = pitchforkScrape;