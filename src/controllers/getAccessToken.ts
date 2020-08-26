import { Response, NextFunction } from 'express';
import * as querystring from 'querystring';

const fetch = require('node-fetch');

export const getAccessToken = (req: any, res: Response, next: NextFunction) => {
    const { code, state } = req.query;

    if (state === null) { // || state !== storedState) {
        console.log('got no state');
        res.redirect('/#' + querystring.stringify(
            {
                error: 'state_mismatch'
            }
        ));
    }

    if (code) {
        const url = 'https://accounts.spotify.com/api/token';

        const data: any = {
            code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: encodeURI(process.env.REDIRECT_URI ?? ''),
        };

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',            
        };

        const searchParams = new URLSearchParams();

        Object.keys(data).forEach(prop => {
            searchParams.set(prop, data[prop]);
        });

        fetch(url, {
            method: 'POST',
            headers,
            body: searchParams
        }).then((res: Response) => res.json())
          .then((credentials: any) => {
              req.credentials = credentials;
              next();
          })
          .catch(next);
    }
}