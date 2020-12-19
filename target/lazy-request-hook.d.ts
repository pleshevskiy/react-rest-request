import { Endpoint, ExtractEndpointParams, ExtractEndpointResponse, ExtractEndpointVariables } from './endpoint';
import { PublicRequestState } from './reducer';
import { ClientResponse } from './client';
export declare type LazyRequestConfig<R, V, P = never> = Readonly<{
    variables?: V;
    params?: P;
    headers?: Record<string, string>;
    onComplete?: (data: R) => unknown;
    onFailure?: (res: ClientResponse<R>) => unknown;
}>;
export declare type LazyRequestHandlerConfig<R, V, P> = Readonly<LazyRequestConfig<R, V, P> & {
    force?: boolean;
}>;
export declare type RequestHandler<R, V, P> = (config?: LazyRequestHandlerConfig<R, V, P>) => Promise<R | null>;
export declare function useLazyRequest<E extends Endpoint<R, V, P>, R = ExtractEndpointResponse<E>, V = ExtractEndpointVariables<E>, P = ExtractEndpointParams<E>>(endpoint: E, config?: LazyRequestConfig<R, V, P>): [RequestHandler<R, V, P>, PublicRequestState<R>];
