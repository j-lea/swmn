import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import Cache from './../Cache';
const fetch = require('node-fetch');

@Controller('api/profile')
class ProfileController {

    private cache: Cache;

    constructor(cache: Cache) {
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
            'Content-Type': 'application/json',            
            'Accept': 'application/json',            
            'Authorization': `Bearer ${accessToken}`,            
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