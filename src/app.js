//const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');

// cheerio query Spotify's New Music Friday playlist

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



//cheerio.load("https://open.spotify.com/playlist/37i9dQZF1DX4JAvHpjipBk");
    // html source --  "view-source:https://open.spotify.com/playlist/37i9dQZF1DX4JAvHpjipBk"

//let title = $('title').text();
//console.log("Title: "+title);

/**
 * 
 * @param {*} targetUrl 

const performScrapeQuery = (targetUrl) => {
    const regex = "\bhttps://en.wikipedia.org/wiki/+[^\s]*\b";
    //let data = {};
    axios.get(targetUrl).then(res = (response)=>{

    }).catch(error => console.error('Error:',error));

}
$('.tracklist-row').each(function(i, elem){
    tracks[i] = {};
    tracks[i]['title'] = $(elem).find('.tracklist-name').text();
    tracks[i]['artist'] = $(elem).find('.tracklist-row__artist-name-link').text();
    tracks[i]['album'] = $(elem).find('.tracklist-row__album-name-link').text();
});
*/