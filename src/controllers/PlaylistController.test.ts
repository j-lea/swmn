import * as supertest from 'supertest';
import {} from 'jasmine';
import * as nock from 'nock';
import { SuperTest, Test } from 'supertest';
import TestServer from '../TestServer';
import PlaylistController from './PlaylistController';
import Cache from './../Cache';
import { Logger } from '@overnightjs/logger';
import { OK, BAD_REQUEST } from 'http-status-codes';
const fetch = require('node-fetch');

describe('PlaylistController', () => {

    const cache = new Cache();

    const baseUrl = 'https://api.spotify.com';
    
    const playlistController = new PlaylistController(cache);
    let agent: SuperTest<Test>;


    beforeAll(done => {
        const server = new TestServer();
        server.setController(playlistController);
        agent = supertest.agent(server.getExpressInstance());
        done();
    });

    // describe('simple test', () => {
    //     it('should test that true === true', () => {
    //         expect(true).toBe(true)
    //     });
    // });

    // describe('Create playlist', () => {

    //     const userId = '1234'; 
    //     const name = 'Oswald';
    
    //     it(`should post to spotify and return a status code 200 if spotify returns OK`, async done => {
    //         // fetchMock
    //         //     .post(`${baseUrl}/v1/users/1234/playlists`, (url: string, options: any) => {
    //         //         return 200;
    //         //     });

    //         // nock(baseUrl)
    //         //     .post('/v1/users/1234/playlists')
    //         //     .matchHeader('Content-Type', 'application/json')
    //         //     .matchHeader('Accept', 'application/json')
    //         //     .reply(OK, {});

    //         const response = await agent.post(`/api/playlists/Oswald`)
    //             .send({userId: '1234'})
    //             .set('Accept', 'application/json')
    //             .set('Content-Type', 'application/json');

    //         expect(response.status).toBe(200);
    //     });

    //     it(`should post to spotify and return a status code 400 if spotify returns 400`, done => {
    //         nock(baseUrl)
    //             .post('/v1/users/1234/playlists')
    //             .reply(BAD_REQUEST, {});

    //         agent.post(`/api/playlists`)
    //             .send({ userId, name })
    //             .end((err, res) => {
    //                 if (err) {
    //                     Logger.Err(err);
    //                 }

    //                 expect(res.status).toBe(BAD_REQUEST);

    //                 // TODO: expect call to be made to spotify

    //                 done();
    //             });
    //     });
    // });

});