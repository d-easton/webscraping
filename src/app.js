const axios = require('axios');
const cheerio = require('cheerio');

// cheerio query Spotify's New Music Friday playlist
const $ = cheerio.load("https://open.spotify.com/playlist/37i9dQZF1DX4JAvHpjipBk");

let tracks = [];
//companiesList[index]['name'] = $(header).find('[itemprop=name]').text();
$('.name').each(function(index, trackElement){
    tracks[index] = {};
    tracks[index]['title'] = $(trackElement).find('.tracklist-name').text();
    tracks[index]['artist'] = $(trackElement).find('.tracklist-row__artist-name-link').text();
    tracks[index]['album'] = $(trackElement).find('.tracklist-row__album-name-link').text();
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