export default interface Song {
    id: string,
    uri: string,
    name: string,
    artists: Artist[],
}

export interface Artist {
    name: string,
}