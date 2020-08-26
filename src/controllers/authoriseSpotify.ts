import { Request, Response } from 'express';
import * as querystring from 'querystring';

const stateKey = 'spotify_auth_state';

const generateRandomString = (length: number) => {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

export const authoriseSpotify = (req: Request, res: Response) => {

    const state = generateRandomString(16);
    res.cookie(stateKey, state, {
        sameSite: "none",
        secure: true,
    });

    var scope = 'user-read-private user-read-email';

    console.log('trying to redirect now');

    const queryString = querystring.stringify({
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: encodeURI(process.env.REDIRECT_URI ?? ''),
        response_type: 'code',
        state: state,
        show_dialog: true,
    });

    res.redirect(`https://accounts.spotify.com/authorize?${queryString}`);
}