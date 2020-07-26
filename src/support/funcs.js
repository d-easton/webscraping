const { default: generate } = require("@babel/generator");
'use strict'

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

const funcs = {
    'generateRandomString':generateRandomString,
    'checkGenre': checkGenre
}

module.exports = funcs;