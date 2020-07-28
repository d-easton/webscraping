'use strict'

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const router = express.Router();

// set up env for mongo
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/scrapehop';

// more mongo
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// configure express routing
app.use(bodyParser.json(), cors());
app.use(require('../route/auth-router'));

// fall through
app.all('*', (request, response) => {
    console.log('Hit fallthrough route, raise 404');
    return response.sendStatus(404);
});

// link middleware
app.use(require('./error-middleware'));

export const start = () => {
    app.listen(PORT, () =>{
        console.log(`Listening on port: ${PORT}`)
    })
}
  
export const stop = () => {
    app.close(PORT, () => {
        console.log(`Shut down on port: ${PORT}`)
    })
}