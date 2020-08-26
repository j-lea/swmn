import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { authoriseSpotify } from './authoriseSpotify';
import { getAccessToken } from './getAccessToken';
import Cache from '../Cache';

interface Credentials {
    access_token: string;
}

@Controller('api/auth')
class AuthController {

    myCache: Cache;
    
    constructor(cache: Cache) {
        this.myCache = cache;
    }

    @Get('login')
    private async LoginToSpotify(req: Request, res: Response) {
        authoriseSpotify(req, res);
    }

    @Get('callback')
    private async callback(req: { credentials: Credentials }, res: Response) {
        getAccessToken(req, res, () => {
            this.myCache.set('accessToken', req.credentials.access_token);
            res.redirect(`http://localhost:3000/?authorised=true`);
        });
    }
}

export default AuthController;