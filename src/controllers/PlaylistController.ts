import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Post, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response, response, NextFunction } from 'express';
import { authoriseSpotify } from './authoriseSpotify';
import { getAccessToken } from './getAccessToken';
import * as NodeCache from 'node-cache';
import Cache from '../Cache';
const fetch = require('node-fetch');

import got from 'got';
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var request = require('request'); // "Request" library

var client_id = 'a565b06eb65e4a43a406f5a9c857c8f3'; // Your client id
var client_secret = 'a0ad8fbf9de84e88b204ed256df1daf0'; // Your secret
var redirect_uri = 'http://localhost:3004/api/playlists/callback'; // Your redirect uri

const stateKey = 'spotify_auth_state';

interface Song {
    id: string;
    name: string;
}

@Controller('api/playlists')
class PlaylistController {

    myCache: Cache;

    constructor(cache: Cache) {
        this.myCache = cache;
    }

        // console.log('about to post the next thing');
        // request.post(authOptions, (err: Error, res: Response, body: any) => {
        //     Logger.Warn('Error: ' + err);
        //     if (!err && response.statusCode === 200) {
        //         const accessToken = body.access_token;
        //         const refreshToken = body.refresh_token;

        //         const options = {
        //             url: 'https://api.spotify.com/v1/me',
        //             headers: { 'Authorization': 'Bearer ' + accessToken },
        //             json: true
        //         };

        //         request.get(options, function(err: Error, res: Response, body: any) {
        //             console.log('Got IT ! ' + body);
        //             console.log(body);
        //         });

        //         const queryString = querystring.stringify({
        //             access_token: accessToken,
        //             refresh_token: refreshToken
        //         });
        //         // we can also pass the token to the browser to make requests from there
        //         res.redirect(`http://localhost:3004/${queryString}`);
        //     } else {
        //         res.redirect('/#' +
        //             querystring.stringify({
        //             error: 'invalid_token'
        //             })
        //         );
        //     }
        // });

    @Post()
    private async createPlaylist(req: Request, res: Response) {
        try {

            const { userId, name } = req.body;

            const { body, statusCode } = await got.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                json: {
                    name
                },
                responseType: 'json'
            });

            return res.status(statusCode).json({});

        } catch(err) {
             Logger.Err(err, true);
             return res.status(BAD_REQUEST).json({
                 error: err.message,
             });
        }
    }
}

export default PlaylistController;