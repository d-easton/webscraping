'use strict'

const express = require('express');
const spotifyRouter = new express.Router();

const querystring = require('querystring');
const request = require('request');
const cookieParser = require('cookie-parser');

const funcs = require('../support/funcs');
const constants = require('../support/constants');

// authorize app with spotify api
const client_id = constants['spotify']['client_id']; 
const redirect_uri = constants['spotify']['redirect_uri']; 
const client_secret = constants['spotify']['client_secret']; 

// for storing login info into cookie dictionary via cookie-parser
const stateKey = 'spotify_auth_state';

spotifyRouter.get('/login', (req, res) => {
    const state = funcs.generateRandomString(16);
    res.cookie(stateKey, state);
  
    // your application requests authorization
    const scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    }));
});

spotifyRouter.get('/processLogin', (req, res) => {

    // state management, based off Spotify's auth recommendations
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;
 
    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
            error: 'state_mismatch'
        }));
    } 
    else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const access_token = body.access_token, refresh_token = body.refresh_token;

                // const options = {
                //     url: 'https://api.spotify.com/v1/me',
                //     headers: { 'Authorization': 'Bearer ' + access_token },
                //     json: true
                // };

                // // Test api connect by querying for logged in user's data
                // request.get(options, function(error, response, body) {
                //     console.log(body);
                // });

                const options = {
                    url: 'https://api.spotify.com/v1/playlists/37i9dQZF1DX4JAvHpjipBk/tracks',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                }
              
                // Fetch from New Music Friday Playlist on Spotify
                request.get(options, function(error, response, body) {
                    let trackObjects = body['items'];
                    for(let trackNumber in trackObjects){
                        if (trackObjects.hasOwnProperty(trackNumber)){
                            let playlistTrack=trackObjects[trackNumber];
                            if (playlistTrack.hasOwnProperty('track')){
                                let track = playlistTrack['track']
                                let trackName = track['name'];
                                let artistNames = '';
                                //let artistGenre = track['artists'][0]['genres'][0];
                                for ( let artist in track['artists']){
                                    if (track['artists'].hasOwnProperty(artist)){
                                        let artists=track['artists'][artist];
                                        artistNames += artists['name']+" ";
                                    }
                                }
                                console.log(trackNumber+": "+trackName+ ' by ' +artistNames);
                            }
                        }
                    }
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                }));
            }
            else {
                res.redirect('/#' +
                querystring.stringify({
                    error: 'invalid_token'
                }));
            }
        });
    }
});

module.exports = spotifyRouter;