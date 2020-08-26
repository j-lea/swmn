import * as supertest from 'supertest';
import {} from 'jasmine';
import * as nock from 'nock';
import { SuperTest, Test } from 'supertest';
import TestServer from '../TestServer';
import PlaylistController from './PlaylistController';
import { Logger } from '@overnightjs/logger';
import { OK, BAD_REQUEST } from 'http-status-codes';

describe('PlaylistController', () => {

    const baseUrl = 'https://api.spotify.com';
    
    const playlistController = new PlaylistController(null);
    let agent: SuperTest<Test>;

    beforeAll(done => {
        const server = new TestServer();
        server.setController(playlistController);
        agent = supertest.agent(server.getExpressInstance());
        done();
    });

    describe('Get songs', () => {
        const name = 'Oswald';

        it(`should post to spotify and return a status code 200 and the IDs, names of the tracks returned by spotify`, done => {
            nock(baseUrl)
                .get('/v1/search?q=Oswald&type=track')
                .reply(OK, {
                    "tracks": {
                        "items": [
                            {
                                "id": "1a",
                                "name": "Oswald",
                            },
                            {
                                "id": "2f",
                                "name": "Oswald that ends wald",
                            },
                            {
                                "id": "14p",
                                "name": "Oswald is a stage",
                            },
                        ]
                    }
                });

            agent.get(`/api/playlists/Oswald`)
                .end((err, res) => {
                    if (err) {
                        Logger.Err(err);
                    }

                    expect(res.status).toBe(OK);
                    expect(res.body).toEqual({
                        tracks: [
                            { id: '1a', name: 'Oswald' },
                            { id: '2f', name: 'Oswald that ends wald' },
                            { id: '14p', name: 'Oswald is a stage' },
                        ]
                    })

                    done();
                });
        });
    });

    describe('Create playlist', () => {

        const userId = '1234'; 
        const name = 'Oswald';
    
        it(`should post to spotify and return a status code 200 if spotify returns OK`, done => {
            nock(baseUrl)
                .post('/v1/users/1234/playlists')
                .reply(OK, {});

            agent.post(`/api/playlists`)
                .type('form')
                .send({ userId, name })
                .set('Accept', 'application/json')
                .end((err, res) => {
                    if (err) {
                        Logger.Err(err);
                    }

                    expect(res.status).toBe(OK);

                    // TODO: expect call to be made to spotify

                    done();
                });
        });

        it(`should post to spotify and return a status code 400 if spotify returns 400`, done => {
            nock(baseUrl)
                .post('/v1/users/1234/playlists')
                .reply(BAD_REQUEST, {});

            agent.post(`/api/playlists`)
                .send({ userId, name })
                .end((err, res) => {
                    if (err) {
                        Logger.Err(err);
                    }

                    expect(res.status).toBe(BAD_REQUEST);

                    // TODO: expect call to be made to spotify

                    done();
                });
        });
    });

});