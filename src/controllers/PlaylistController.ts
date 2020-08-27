import { OK } from 'http-status-codes';
import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import Cache from '../Cache';
import Song from './../Song';
const fetch = require('node-fetch');

@Controller('api/playlists')
class PlaylistController {

    cache: Cache;

    constructor(cache: Cache) {
        this.cache = cache;
    }

    @Post(':name')
    private async createPlaylist(req: Request, res: Response) {
        const { userId, songs } = req.body;
        const accessToken = this.cache.get('accessToken');

        const playlistId = await this.createEmptyPlaylist(userId, accessToken);

        await this.addSongsToPlaylist(playlistId, songs, accessToken);

        return res.status(OK).json({});
    }

    private async createEmptyPlaylist(userId: string, accessToken: string): Promise<string> {
        const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
        const headers = {
            'Content-Type': 'application/json',            
            'Accept': 'application/json',            
            'Authorization': `Bearer ${accessToken}`,            
        };

        const data: any = {
            name: 'Songs With My Name In 2',
            description: 'Created by SWMN',
            public: true
        };

        const response = await fetch(url, {
            body: JSON.stringify(data),
            headers,
            method: 'POST',
        });
        const responseJson = await response.json();

        return responseJson.id;
    }

    private async addSongsToPlaylist(id: string, songs: Song[], accessToken: string) {
        const url = `https://api.spotify.com/v1/playlists/${id}/tracks`;
        const headers = {
            'Content-Type': 'application/json',            
            'Accept': 'application/json',            
            'Authorization': `Bearer ${accessToken}`,            
        };

        const uris = songs.map(song => song.uri).join(',');
        const data: any = {
            uris
        };

        const urlWithParams = url + '?uris=' + uris;
        const response = await fetch(urlWithParams, {
            // body: JSON.stringify(data),
            headers,
            method: 'POST',
        });

        const responseJson = await response.json();
    }
}

export default PlaylistController;