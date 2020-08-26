import { OK } from 'http-status-codes';
import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import Cache from '../Cache';
import Song from './../Song';
const fetch = require('node-fetch');

@Controller('api/songs')
class SongsController {

    myCache: Cache;

    constructor(cache: Cache) {
        this.myCache = cache;
    }
    
    @Get(':name')
    private async getSongsWithNameIn(req: Request, res: Response) {
        const name = req.params.name;
        const accessToken = this.myCache.get('accessToken');
        if (!accessToken) {
            return undefined;
        }

        const url = `https://api.spotify.com/v1/search?q=${name}&type=track`;
        const headers = {
            'Content-Type': 'application/json',            
            'Accept': 'application/json',            
            'Authorization': `Bearer ${accessToken}`,            
        };

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });
        const responseJson = await response.json();

        const tracks = responseJson.tracks.items.map((t: Song) => { return {id: t.id, name: t.name}});
        return res.status(OK).json({
            tracks
        });
    }
}

export default SongsController;