import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { DelayPage, MainPage } from './pages';


export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/'>
                    <MainPage />
                </Route>
                <Route exact path='/delay'>
                    <DelayPage />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}
