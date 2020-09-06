import { OK } from 'http-status-codes';
import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import Song from './../Song';
import fetch from 'node-fetch';
import ICache from '../ICache';

@Controller('api/songs')
class SongsController {

    cache: ICache;

    constructor(cache: ICache) {
        this.cache = cache;
    }
    
    @Get(':name')
    private async getSongsWithNameIn(req: Request, res: Response) {        
        const name = req.params.name;
        const accessToken = this.cache.get('accessToken');
        
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

        const tracks = responseJson.tracks.items.map((t: Song) => { 
            const artists = t.artists.map(a => a.name);
            return {
                id: t.id, 
                name: t.name,
                artists,
                uri: t.uri,
            }
        });

        return res.status(OK).json({
            tracks
        });
    }
}

export default SongsController;