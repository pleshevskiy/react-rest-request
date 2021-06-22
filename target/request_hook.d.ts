import { AnyEndpoint } from './endpoint';
import { LazyRequestConfigFromEndpoint } from './lazy_request_hook';
export interface RequestConfigFromEndpoint<E extends AnyEndpoint> extends LazyRequestConfigFromEndpoint<E> {
    readonly skip?: boolean;
}
export declare function useRequest<E extends AnyEndpoint>(endpoint: E, config?: RequestConfigFromEndpoint<E>): import("./lazy_request_hook").PublicRequestStateWithActions<E>;
