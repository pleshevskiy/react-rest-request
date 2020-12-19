import React from 'react';
import { useRequest } from 'react-rest-request';
import { Link, useParams } from 'react-router-dom';
import { MovieEndpoint, MoviesEndpoint } from './endpoint';


export function MoviesPage() {
    const { data, loading } = useRequest(MoviesEndpoint);

    return !data ? (
        <div>{ loading ? 'Loading...' : 'Something went wrong' }</div>
    ) : (
        <ul>
            {data.items
                .filter(movie => !!movie.title)
                .map(movie => (
                    <li key={movie.id}>
                        <Link to={`/${movie.id}`}>{movie.title}</Link>
                    </li>
                ))}
            <li>
                <Link to='/9999'><span style={{color: 'red'}}>NOT EXIST</span></Link>
            </li>
        </ul>
    );
}

export function MoviePage() {
    const params = useParams<{ id: string}>();
    const { data, loading } = useRequest(
        MovieEndpoint,
        {
            params,
            onFailure(res) {
                alert(JSON.stringify(res));
            }
        }
    );

    return !data ? (
        <div>{ loading ? 'Loading...' : 'Something went wrong' }</div>
    ) : <div>{JSON.stringify(data)}</div>;
}
