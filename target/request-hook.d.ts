import { AnyEndpoint } from './endpoint';
import { LazyRequestConfigFromEndpoint } from './lazy-request-hook';
export declare type RequestConfigFromEndpoint<E extends AnyEndpoint> = Readonly<LazyRequestConfigFromEndpoint<E> & {
    skip?: boolean;
}>;
export declare function useRequest<E extends AnyEndpoint>(endpoint: E, config?: RequestConfigFromEndpoint<E>): import("./lazy-request-hook").PublicRequestStateWithActions<E>;
