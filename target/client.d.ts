import { Method } from './endpoint';
export interface ClientConfig {
    baseUrl: string;
}
export interface PrepareRequestProps {
    url: string;
    method: Method;
    headers: Record<string, string>;
    variables: Record<string, any> | FormData;
}
export declare type RequestProps<R> = PrepareRequestProps & {
    transformResponseData?: (data: unknown) => R;
};
export declare type ResponseWithError = Pick<Response, 'ok' | 'redirected' | 'status' | 'statusText' | 'type' | 'headers' | 'url'> & Readonly<{
    error?: Error;
    canceled?: boolean;
}>;
export declare type ClientResponse<Data extends Record<string, any>> = ResponseWithError & Readonly<{
    data: Data;
}>;
export declare class Client {
    private readonly config;
    private controller;
    constructor(config: ClientConfig);
    prepareRequest(props: PrepareRequestProps): Request;
    request<Data extends Record<string, any>>({ transformResponseData, ...restProps }: RequestProps<Data>): Promise<ClientResponse<Data>>;
    cancelRequest(): void;
}
