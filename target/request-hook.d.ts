import { Endpoint, ExtractEndpointParams, ExtractEndpointResponse, ExtractEndpointVariables } from './endpoint';
import { LazyRequestConfig } from './lazy-request-hook';
export declare type RequestConfig<R, V, P> = Readonly<LazyRequestConfig<R, V, P> & {
    skip?: boolean;
}>;
export declare function useRequest<E extends Endpoint<R, V, P>, R = ExtractEndpointResponse<E>, V = ExtractEndpointVariables<E>, P = ExtractEndpointParams<E>>(endpoint: E, config?: RequestConfig<R, V, P>): import("./lazy-request-hook").PublicRequestStateWithRefetch<R>;
