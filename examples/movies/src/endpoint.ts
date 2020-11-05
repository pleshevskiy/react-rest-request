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


export const MovieEndpoint: Endpoint<MovieParams> = {
    method: Method.GET,
    url: ({ id }) => `/action-adventure/${id}`,
};

export type MovieParams = Readonly<{ id: React.Key }>;

export type MovieResponse = Movie[];
