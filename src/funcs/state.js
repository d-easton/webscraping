// Helper methods for state management

/**
 * Generates random string w/ numbers and letters
 * @param  {number} length of string to generate
 * @return {string} string with randomized letters and numbers
 */
const generateRandomString = function(length) {
    const buildRandomString = '';
    const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        buildRandomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }
    return buildRandomString;
};

//export genereateRandsomString();