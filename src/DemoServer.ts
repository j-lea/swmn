// import * as path from 'path';
// import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Server, Controller } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import AuthController from './controllers/AuthController';
import PlaylistController from './controllers/PlaylistController';
import ProfileController from './controllers/ProfileController';
import Cache from './Cache';
import SongsController from './controllers/SongsController';
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

class DemoServer extends Server {
    
    private readonly SERVER_START_MSG = 'Demo server started on port: ';
    private readonly DEV_MSG = 'Express server is running in development mode ';

    constructor() {
        super(true);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cors());

        this.setUpControllers();

        if (process.env.NODE_ENV !== 'production') {
            const msg = this.DEV_MSG + process.env.EXPRESS_PORT;
            this.app.get('*', (req, res) => res.send(msg));
        }
    }

    private setUpControllers(): void {
        const cache = new Cache();
        super.addControllers(new AuthController(cache));
        super.addControllers(new PlaylistController(cache));
        super.addControllers(new ProfileController(cache));
        super.addControllers(new SongsController(cache));
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            Logger.Imp(this.SERVER_START_MSG + port);
        });
    }
}

export default DemoServer;