import React from 'react';
import ReactDOM from 'react-dom';
import { RequestProvider, Client } from 'react-rest-request';
import App from './app';

const client = new Client({
  baseUrl: 'https://httpbin.org',
});

ReactDOM.render(
  <React.StrictMode>
    <RequestProvider client={client}>
      <App />
    </RequestProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
