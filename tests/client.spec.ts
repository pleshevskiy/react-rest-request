import { Client } from '../src/client';
import { Method } from '../src/endpoint';
import * as nodeFetch from 'node-fetch';

beforeAll(() => {
    global.Response = nodeFetch.Response as any;
    global.Request = nodeFetch.Request as any;
    global.Headers = nodeFetch.Headers as any;
});


describe('client', () => {
    describe('::prepareRequest', () => {
        it('should prepare request successfully', () => {
            const client = new Client({
                baseUrl: 'https://example.org/api'
            });

            const preparedRequest = client.prepareRequest({
                url: '/',
                method: Method.GET,
                headers: {},
                variables: {},
            });

            expect(preparedRequest.url).toBe('https://example.org/api/');
            expect(preparedRequest.method).toBe(Method.GET);
        });

        it('should prepare request successfully if client with relative base url', () => {
            const client = new Client({
                baseUrl: '/api'
            });

            const preparedRequest = client.prepareRequest({
                url: '/',
                method: Method.GET,
                headers: {},
                variables: {},
            });

            expect(preparedRequest.url).toBe('http://localhost/api/');
            expect(preparedRequest.method).toBe(Method.GET);
        });
    });
});
