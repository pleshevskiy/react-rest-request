# react-rest-request

Minimalistic REST API client for React inspired by Apollo.


# Installation

```bash
npm install react-rest-request --save
```


# Usage

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import { Client, Endpoint, Method, useRequest, RequestProvider } from 'react-rest-request';

const client = Client({
    baseUrl: 'https://sampleapis.com/movies/api',
});

type Movie = Readonly<{
    id: number;
    title: string;
    posterURL: string;
    imdbId: string;
}>

const MoviesEndpoint: Endpoint = {
    method: Method.GET,
    url: '/action-adventure',
};

type MoviesResponse = Movie[];

function App() {
    const [movies, { data, loading }] = useRequest<MoviesResponse>(MoviesEndpoint);

    React.useEffect(
        () => {
            movies();
        },
        [movies]
    );

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

ReactDOM.render(
    <RequestProvider client={client}>
        <App />
    </RequestProvider>,
    document.getElementById('root'),
);
```
