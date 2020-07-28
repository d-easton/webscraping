'use strict'
const cheerio = require('cheerio');
const request = require('request');

const funcs = require('../support/funcs');
const constants = require('../support/constants');

/**
 * Scrape XXL best songs of the year
 * Return [] conainting artist, track current reviews
 */
const scrapeXXLBestOf2020 = () => { 
    const targetUrl = "https://www.xxlmag.com/best-hip-hop-songs-2020-so-far/";
    request(targetUrl, (err, res, body) =>{
        const $ = cheerio.load(body);
        let results = [];
        let cleanRegex = /^[ '"]+|[ '"]+$/g;
        $('.list-post-right h2').each((i, elem) => {
            let newTrack = {};
            // scrape track name, remove leading & trailing spaces and "" marks
            newTrack['track'] = $(elem).text().replace(cleanRegex, "");       
            results[i] = newTrack;
        });
        $('small').each((i, elem) => {
            results[i]['artist'] = $(elem).text().replace(cleanRegex, "");
        });
        console.log(results);
        return results;
    });
}

/**
 * Scrape XXL best songs weekly
 * Return [] conainting artist, track for this weeks reviews reviews
 */
const scrapeXXLWeekly = () => { 
    const targetUrl = constants["links"]["xxlWeeky"];
    request(targetUrl, (err, res, body) =>{
        const $ = cheerio.load(body);
        let results = [];
        let cleanRegex = /^[ '"]+|[ '"]+$/g;
        $('.list-post-right h2').each((i, elem) => {
            let newTrack = {};
            // scrape track name, remove leading & trailing spaces and "" marks
            newTrack['track'] = $(elem).text().replace(cleanRegex, "");       
            results[i] = newTrack;
        });
        $('small').each((i, elem) => {
            results[i]['artist'] = $(elem).text().replace(cleanRegex, "");
        });
        console.log(results);
        return results;
    });
}

const xxlScrape = {
    'yearlyReviews': scrapeXXLBestOf2020,
    'weeklyReviews': scrapeXXLWeekly
}

module.exports = xxlScrape;