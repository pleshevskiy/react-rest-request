import React from 'react';
import { useRequest } from 'react-rest-request';
import { MoviesEndpoint, MoviesResponse } from './endpoint';

export default function App() {
    const { data, loading } = useRequest<MoviesResponse>(MoviesEndpoint);

    return !data ? (
        <div>{ loading ? 'Loading...' : 'Something went wrong' }</div>
    ) : (
        <ul>
            {data.map(movie => (
                <li key={movie.id}>{movie.title}</li>
            ))}
        </ul>
    );
}
