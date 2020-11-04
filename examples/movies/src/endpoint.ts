import { Endpoint, Method } from 'react-rest-request';

export type Movie = Readonly<{
    id: number;
    title: string;
    posterURL: string;
    imdbId: string;
}>

export const MoviesEndpoint: Endpoint = {
    method: Method.GET,
    url: '/action-adventure',
};

export type MoviesResponse = Movie[];