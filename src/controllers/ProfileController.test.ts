import * as supertest from 'supertest';
import {} from 'jasmine';
import { SuperTest, Test } from 'supertest';
import TestServer from '../TestServer';
import ProfileController from './ProfileController';
import ICache from '../ICache';

jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox());
const fetchMock = require('node-fetch');

let accessToken = '33333';
const mockCache: ICache = {
    get: () => accessToken,
    set: () => {},
}

describe('ProfileController', () => {
    
    const profileController = new ProfileController(mockCache);
    let agent: SuperTest<Test>;

    beforeAll(done => {
        const server = new TestServer();
        server.setController(profileController);
        agent = supertest.agent(server.getExpressInstance());
        done();
    });

    afterEach(() => {
        fetchMock.restore();
    })

    describe('Get profile', () => {

        const profileResponse = {
            display_name: 'Jenny',
            id: '1234'
        };

        it(`makes a GET request to spotify and returns the profile`, async () => {
            fetchMock.get({
                url: `https://api.spotify.com/v1/me`,
            }, profileResponse);

            const response = await agent.get(`/api/profile`);

            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith(`https://api.spotify.com/v1/me`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json' },
                method: 'GET'
            });
                
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                name: 'Jenny',
                id: '1234'
            });
        });
    });

});