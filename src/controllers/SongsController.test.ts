import * as supertest from 'supertest';
import {} from 'jasmine';
import * as nock from 'nock';
import { SuperTest, Test } from 'supertest';
import TestServer from '../TestServer';
import PlaylistController from './PlaylistController';
import Cache from '../Cache';
import { Logger } from '@overnightjs/logger';
import { OK, BAD_REQUEST } from 'http-status-codes';
import fetch from 'node-fetch';

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch', () => jest.fn());

describe('SongsController', () => {

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

    beforeEach(() => {
    });

    describe('Get songs', () => {

        const userId = '1234'; 
        const name = 'Oswald';
    
        it(`makes a GET request to spotify and returns the songs with name and artist`, async done => {

            const songsResponse = {
                tracks: {
                    items: [
                        {
                            id: '1234',
                            name: 'Beep boop',
                            artists: ['Kraftwerk'],
                            otherStuff: 'not relevant',
                        },
                        {
                            id: '4',
                            name: 'Boop the magic dragon',
                            artists: ['Elton John'],
                            nope: 'still not relevant',
                        },
                        {
                            id: '666',
                            name: 'Boops on my guitar',
                            artists: ['T Swiz'],
                            lists: ['lalalalal', 'bing bong'],
                        },
                    ]
                }
            };


            (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(new Response(
                JSON.stringify(songsResponse)
            ));

            

            const response = await agent.post(`/api/songs/Boop`)
                .send({userId: '1234'})
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json');

            // expect call to have been make do
            // expect(spotifyMock.toHaveBeenCalledWith());

            expect(response.status).toBe(200);
            expect(response.body).toBe([
                {
                    id: '1234',
                    name: 'Beep boop',
                    artists: ['Kraftwerk'],
                },
                {
                    id: '4',
                    name: 'Boop the magic dragon',
                    artists: ['Elton John'],
                },
                {
                    id: '666',
                    name: 'Boops on my guitar',
                    artists: ['T Swiz'],
                },
            ]);
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