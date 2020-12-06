import { Method } from './endpoint';
export declare type ClientConfig = {
    baseUrl: string;
};
declare type PrepareRequestProps = {
    url: string;
    method: Method;
    headers: Record<string, string>;
    variables: Record<string, any> | FormData;
};
export declare type RequestProps<R> = PrepareRequestProps & {
    transformResponseData?: (data: unknown) => R;
};
export declare type ClientResponse<Data extends Record<string, any>> = Readonly<Pick<Response, 'ok' | 'redirected' | 'status' | 'statusText' | 'type' | 'headers' | 'url'> & {
    data: Data;
}>;
export declare class Client {
    private config;
    constructor(config: ClientConfig);
    private prepareRequest;
    request<Data extends Record<string, any>>({ transformResponseData, ...restProps }: RequestProps<Data>): Promise<ClientResponse<Data>>;
}
export {};
