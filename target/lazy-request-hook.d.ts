import { AnyEndpoint, ExtractEndpointParams, ExtractEndpointResponse, ExtractEndpointVariables } from './endpoint';
import { PublicRequestState } from './reducer';
import { ClientResponse } from './client';
export declare type LazyRequestConfig<R, V, P> = Readonly<{
    variables?: V;
    params?: P;
    headers?: Record<string, string>;
    onComplete?: (data: R) => unknown;
    onFailure?: (res: ClientResponse<R>) => unknown;
}>;
export declare type LazyRequestConfigFromEndpoint<E extends AnyEndpoint> = LazyRequestConfig<ExtractEndpointResponse<E>, ExtractEndpointVariables<E>, ExtractEndpointParams<E>>;
export declare type LazyRequestHandlerConfig<E extends AnyEndpoint> = Readonly<LazyRequestConfigFromEndpoint<E> & {
    force?: boolean;
}>;
export declare type RequestHandler<E extends AnyEndpoint> = (config?: LazyRequestHandlerConfig<E>) => Promise<ExtractEndpointResponse<E> | null>;
export declare type RefetchRequestHandler = () => void;
export declare type PublicRequestStateWithRefetch<E extends AnyEndpoint> = PublicRequestState<ExtractEndpointResponse<E>> & {
    refetch: RefetchRequestHandler;
};
export declare function useLazyRequest<E extends AnyEndpoint>(endpoint: E, config?: LazyRequestConfigFromEndpoint<E>): [RequestHandler<E>, PublicRequestStateWithRefetch<E>];
