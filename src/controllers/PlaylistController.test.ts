import * as supertest from 'supertest';
import {} from 'jasmine';
import { SuperTest, Test } from 'supertest';
import TestServer from '../TestServer';
import PlaylistController from './PlaylistController';
import ICache from '../ICache';

jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox());
const fetchMock = require('node-fetch');

const accessToken = '33333';
const mockCache: ICache = {
    get: () => accessToken,
    set: () => {},
}

describe('PlaylistController', () => {
    
    const playlistController = new PlaylistController(mockCache);
    let agent: SuperTest<Test>;

    beforeAll(done => {
        const server = new TestServer();
        server.setController(playlistController);
        agent = supertest.agent(server.getExpressInstance());
        done();
    });

    afterEach(() => {
        fetchMock.restore();
    })

    describe('Create playlist', () => {

        const songs = [
            {
                name: 'Beep boop',
                uri: 'aaa',
            },
            {
                name: 'Boop the magic dragon',
                uri: 'abc',
            },
            {
                name: 'Boops on my guitar',
                uri: 'xxx',
            },
        ];
    
        it(`makes a POST request to spotify with the playlist name then adds the songs to the playlist created`, async () => {
            const userId = '66666';
            const playlistId = '1234';
            const name = 'Jenny';

            fetchMock.post({
                url: `https://api.spotify.com/v1/users/${userId}/playlists`,
            }, { id: playlistId });

            fetchMock.post({
                url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=aaa,abc,xxx`,
            }, {});

            const response = await agent.post(`/api/playlists/${name}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    userId: userId,
                    songs
                });

            expect(fetchMock).toHaveBeenCalledTimes(2);
            expect(fetchMock).toHaveBeenCalledWith(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({
                    name: 'Songs With My Name In',
                    description: 'Created by SWMN',
                    public: true
                }),
            });

            expect(fetchMock).toHaveBeenCalledWith(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=aaa,abc,xxx`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json' },
                method: 'POST',
            });

            expect(response.status).toBe(200);
        });
    });

});