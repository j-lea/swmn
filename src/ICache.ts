export default interface ICache {

    get: (key: string) => string;

    set: (key: string, value: any) => void;
}