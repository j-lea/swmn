import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import ICache from './../ICache';
const fetch = require('node-fetch');

@Controller('api/profile')
class ProfileController {

    private cache: ICache;

    constructor(cache: ICache) {
        this.cache = cache;
    }

    @Get('')
    private async getProfile(req: Request, res: Response) {
        const accessToken = this.cache.get('accessToken');
        if (!accessToken) {
            return undefined;
        }

        const url = 'https://api.spotify.com/v1/me';
        const headers = {
            'Accept': 'application/json',            
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',                   
        };

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });
        const responseJson = await response.json();

        return res.status(OK).json({
            name: responseJson.display_name,
            id: responseJson.id,
        });
    }
}

export default ProfileController;