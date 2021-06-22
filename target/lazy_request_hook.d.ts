import { AnyEndpoint, ExtractEndpointParams, ExtractEndpointResponse, ExtractEndpointVariables } from './endpoint';
import { PublicRequestState } from './reducer';
import { ClientResponse } from './client';
export interface LazyRequestConfig<R, V, P> {
    readonly variables?: V;
    readonly params?: P;
    readonly headers?: Record<string, string>;
    readonly onComplete?: (data: R) => unknown;
    readonly onFailure?: (res: ClientResponse<R>) => unknown;
}
export declare type LazyRequestConfigFromEndpoint<E extends AnyEndpoint> = LazyRequestConfig<ExtractEndpointResponse<E>, ExtractEndpointVariables<E>, ExtractEndpointParams<E>>;
export interface LazyRequestHandlerConfig<E extends AnyEndpoint> extends LazyRequestConfigFromEndpoint<E> {
    readonly force?: boolean;
}
export declare type RequestHandler<E extends AnyEndpoint> = (config?: LazyRequestHandlerConfig<E>) => Promise<ExtractEndpointResponse<E> | null>;
export interface PublicRequestStateWithActions<E extends AnyEndpoint> extends PublicRequestState<ExtractEndpointResponse<E>> {
    readonly refetch: () => void;
    readonly cancel: () => void;
    readonly clearStore: () => void;
}
export declare function useLazyRequest<E extends AnyEndpoint>(endpoint: E, config?: LazyRequestConfigFromEndpoint<E>): [RequestHandler<E>, PublicRequestStateWithActions<E>];
