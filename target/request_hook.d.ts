import { AnyEndpoint } from './endpoint';
import { LazyRequestConfigFromEndpoint } from './lazy_request_hook';
export declare type RequestConfigFromEndpoint<E extends AnyEndpoint> = Readonly<LazyRequestConfigFromEndpoint<E> & {
    skip?: boolean;
}>;
export declare function useRequest<E extends AnyEndpoint>(endpoint: E, config?: RequestConfigFromEndpoint<E>): import("./lazy_request_hook").PublicRequestStateWithActions<E>;
