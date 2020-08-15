const goose = require('./mongooseConnect.js');

const trackDocument = {
    "title": "Breathe In Breathe Out",
    "artists": ["Kanye West"],                                                                                                                             
    "published": new Date(2020, 1, 1),                                                                                                                            
    "scraped": Date.now(),
    "genre": "Rap"
}
console.log("begin test");
goose.insert(trackDocument);
console.log("test complete");