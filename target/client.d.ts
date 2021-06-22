import { Method } from './endpoint';
export interface ClientConfig {
    readonly baseUrl: string;
}
export interface PrepareRequestProps {
    readonly url: string;
    readonly method: Method;
    readonly headers: Record<string, string>;
    readonly variables: Record<string, any> | FormData;
}
export interface RequestProps<R> extends PrepareRequestProps {
    readonly transformResponseData?: (data: unknown) => R;
    readonly abortSignal: AbortSignal;
}
export declare type ResponseWithError = Pick<Response, 'ok' | 'redirected' | 'status' | 'statusText' | 'type' | 'headers' | 'url'> & Readonly<{
    error?: Error;
    canceled?: boolean;
}>;
export declare type ClientResponse<Data extends Record<string, any>> = ResponseWithError & Readonly<{
    data: Data;
}>;
export declare class Client {
    private readonly config;
    constructor(config: ClientConfig);
    prepareRequest(props: PrepareRequestProps): Request;
    request<Data extends Record<string, any>>({ transformResponseData, abortSignal, ...restProps }: RequestProps<Data>): Promise<ClientResponse<Data>>;
}
