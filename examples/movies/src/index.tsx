import React from 'react';
import ReactDOM from 'react-dom';
import { RequestProvider } from 'react-rest-request';
import { BASE_API_URL } from './constants';
import App from './app';

ReactDOM.render(
  <React.StrictMode>
    <RequestProvider baseUrl={BASE_API_URL}>
      <App />
    </RequestProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
