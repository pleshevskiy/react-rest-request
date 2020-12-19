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

const client = new Client({
    baseUrl: 'https://sampleapis.com/movies/api',
});

type Movie = Readonly<{
    id: number;
    title: string;
    posterURL: string;
    imdbId: string;
}>

const MoviesEndpoint: Endpoint<MoviesResponse, void> = {
    method: Method.GET,
    url: '/action-adventure',
};

type MoviesResponse = Movie[];

function App() {
    const { data, loading } = useRequest(MoviesEndpoint);

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

### Transform response

If you have an endpoint that doesn't fit into your beautiful architecture
with its response data, you can transform the response before it's written
to the state.

```typescript
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
```

# License

Released under the [MIT License].


[MIT License]: https://github.com/pleshevskiy/react-rest-request/blob/master/LICENSE.md
