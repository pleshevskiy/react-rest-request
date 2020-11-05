import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { MoviePage, MoviesPage } from './pages';


export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/'>
                    <MoviesPage />
                </Route>
                <Route exact path='/:id'>
                    <MoviePage />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}
