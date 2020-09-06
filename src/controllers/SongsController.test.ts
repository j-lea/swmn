import * as supertest from 'supertest';
import {} from 'jasmine';
import { SuperTest, Test } from 'supertest';
import TestServer from '../TestServer';
import SongsController from './SongsController';
import Cache from '../Cache';

jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox());
const fetchMock = require('node-fetch');

describe('SongsController', () => {

    const cache = new Cache();
    
    const songsController = new SongsController(cache);
    let agent: SuperTest<Test>;

    beforeAll(done => {
        const server = new TestServer();
        server.setController(songsController);
        agent = supertest.agent(server.getExpressInstance());
        done();
    });

    beforeEach(() => {
    });

    afterEach(() => {
        fetchMock.restore();
    })

    describe('Get songs', () => {

        const name = 'Boop';
        const accessToken = '12';
        const songsResponse = {
            tracks: {
                items: [
                    {
                        id: '1234',
                        name: 'Beep boop',
                        artists: [{ name: 'Kraftwerk' }],
                        otherStuff: 'not relevant',
                    },
                    {
                        id: '4',
                        name: 'Boop the magic dragon',
                        artists: [{ name: 'Elton John' }],
                        nope: 'still not relevant',
                    },
                    {
                        id: '666',
                        name: 'Boops on my guitar',
                        artists: [{ name: 'T Swiz' }, { name: 'Kanye'}],
                        lists: ['lalalalal', 'bing bong'],
                    },
                ]
            }
        };
    
        it(`makes a GET request to spotify and returns the songs with name and artist`, async () => {
            fetchMock.get({
                url: `https://api.spotify.com/v1/search?q=${name}&type=track`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }}, songsResponse);

            const response = await agent.get(`/api/songs/${name}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            expect(fetchMock).toHaveBeenCalledTimes
            expect(fetchMock).toHaveBeenCalledWith(`https://api.spotify.com/v1/search?q=${name}&type=track`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json' },
                method: 'GET'
            });
                
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                tracks: [
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
                        artists: ['T Swiz', 'Kanye'],
                    }
                ]
            });
        });
    });

});