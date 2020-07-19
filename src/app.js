//const axios = require('axios');
const cheerio = require('cheerio');

// cheerio query Spotify's New Music Friday playlist
const $ = cheerio.load("https://open.spotify.com/playlist/37i9dQZF1DX4JAvHpjipBk");
    // html source --  "view-source:https://open.spotify.com/playlist/37i9dQZF1DX4JAvHpjipBk"

let title = $('title').text();
console.log("Title: "+title);

let tracks = [];
$('.tracklist-row').each(function(i, elem){
    tracks[i] = {};
    tracks[i]['title'] = $(elem).find('.tracklist-name').text();
    tracks[i]['artist'] = $(elem).find('.tracklist-row__artist-name-link').text();
    tracks[i]['album'] = $(elem).find('.tracklist-row__album-name-link').text();
});

console.log(tracks);


/**
 * 
 * @param {*} targetUrl 

const performScrapeQuery = (targetUrl) => {
    const regex = "\bhttps://en.wikipedia.org/wiki/+[^\s]*\b";
    //let data = {};
    axios.get(targetUrl).then(res = (response)=>{

    }).catch(error => console.error('Error:',error));

}
*/