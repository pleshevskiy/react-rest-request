import { Endpoint, Method } from 'react-rest-request';

export const DelayEndpoint: Endpoint<{ url: string}, void, { seconds: number }> = {
    method: Method.GET,
    url: ({ seconds }) => `/delay/${seconds}`,
    transformResponseData({ url }: any) {
        return { url }
    }
};
