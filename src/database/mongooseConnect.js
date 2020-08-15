const mongoose = require('mongoose');
const trackSchema = require('./schema/trackSchema');

const InsertTrack = {
    Track: mongoose.model('track', trackSchema),
    //atlasURL: 'mongodb+srv://scrapehopAdmin:RRYS00JrelZJQwTQ@scrapehopdb.mnv7v.azure.mongodb.net/tracks?retryWrites=true&w=majority',

    createTrack: async (title, artists, published, scraped, genre) => {
        console.log(title);
        console.log(artists);
        console.log(published);
        console.log(scraped);
        console.log(genre);
        return new Track({
            title,
            artists,
            published,
            scraped, // : Date.now()
            genre
        }).save()
    },

    findTrack: async (title) => {
        return await Track.findOne( {title} );
    },

    insert: async (scrape) => {
        const url = 'mongodb+srv://scrapehopAdmin:RRYS00JrelZJQwTQ@scrapehopdb.mnv7v.azure.mongodb.net/tracks?retryWrites=true&w=majority';
        console.log(url);
        console.log(typeof(url));
        const connector = mongoose.connect(url); //, {useNewUrlParser: true} );
        
        let track = await connector.then(async () => {
            return findTrack(title);
        });

        if (!track) {
            track = await createTrack (
                scrape["title"], 
                scrape["artists"], 
                scrape["published"], 
                scrape["scraped"], 
                scrape["genre"]
            );
        }

        console.log(track)
    },
}

// This object bundling isn't working

module.exports = InsertTrack;