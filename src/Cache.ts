import * as NodeCache from 'node-cache';
import ICache from './ICache';

export default class Cache implements ICache {

    private readonly cache: NodeCache;
    
    constructor(ttlSeconds: number = 3600) {
        this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
    }

    get(key: string): any {
        return this.cache.get(key);
    }

    set(key: string, value: any): void {
        this.cache.set(key, value);
    }

    // flush() {
    //     this.cache.flushAll();
    // }
}