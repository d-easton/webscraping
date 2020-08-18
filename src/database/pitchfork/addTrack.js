const mongoose = require('mongoose');
const trackSchema = require('../schema/trackSchema');

const Track = mongoose.model('track', trackSchema);

createTrack = async (title, artists, published, scraped, genre) => {
    console.log("create track");
    return new Track({
        title,
        artists,
        published,
        scraped, // : Date.now()
        genre
    }).save()
};

findTrack = async (title) => {
    return await Track.findOne( {title} );
};

insert = async (scrape) => {
    const url = 'mongodb+srv://scrapehopAdmin:RRYS00JrelZJQwTQ@scrapehopdb.mnv7v.azure.mongodb.net/tracks?retryWrites=true&w=majority';
    const connector = mongoose.connect(url, {useNewUrlParser: true} );
        
    let track = await connector.then(async () => {
        return findTrack(scrape["title"]);
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
    console.log("created track ---");
    console.log(track);
};

// export utilities
module.exports.track = Track;
module.exports.createTrack = createTrack;
module.exports.findTrack = findTrack;
module.exports.insert = insert;