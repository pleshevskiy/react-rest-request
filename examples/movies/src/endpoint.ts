import { Endpoint, Method } from 'react-rest-request';

export type Movie = Readonly<{
    id: number;
    title: string;
    posterURL: string;
    imdbId: string;
}>

export const MoviesEndpoint: Endpoint<MoviesResponse, void> = {
    method: Method.GET,
    url: '/action-adventure',
    transformResponseData(data: Movie[]) {
        return {
            items: data,
        }
    }
};

export type MoviesResponse = {
    items: Movie[],
}

export const MovieEndpoint: Endpoint<MovieResponse, never, MovieParams> = {
    method: Method.GET,
    url: ({ id }) => `/action-adventure/${id}`,
};

export type MovieParams = Readonly<{ id: React.Key }>;

export type MovieResponse = Movie;
