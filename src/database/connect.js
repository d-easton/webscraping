const { MongoClient } = require("mongodb");
 
// Atlas connection string, from documentation                                                                                                                                        
const url = "mongodb+srv://scrapehopAdmin:RRYS00JrelZJQwTQ@scrapehopdb.mnv7v.azure.mongodb.net/tracks?retryWrites=true&w=majority";
const client = new MongoClient(url);

// Use tracks database within Mongo cluster
const dbName = "tracks";

async function run() {
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);

        // Use collection pitchfork corresponding to tracks scraped from Pitchfork
        const col = db.collection("pitchfork");

        // Construct a document                                                                                                                                                              
        let trackDocument = {
            "title": "test",
            "artists": ["Kendrick Lamar", "Kanye West", "Drake"],                                                                                                                             
            "published": new Date(2020, 1, 1),                                                                                                                            
            "scraped": new Date(2020, 8, 15),
            "genre": "Rap"
        }

        // Insert a single document, wait for promise so we can read it back
        const t = await col.insertOne(trackDocument);
        
        // Find one document
        const myDoc = await col.findOne();
        
        // Print to the console
        console.log(myDoc);

    } catch (err) {
        console.log(err.stack);
    }
    
    finally {
        await client.close();
    }
}

run().catch(console.dir);
