import React from 'react';
import invariant from 'tiny-invariant';
import { AnyEndpoint, Method } from './endpoint';
import { LazyRequestConfigFromEndpoint, useLazyRequest } from './lazy_request_hook';

export type RequestConfigFromEndpoint<E extends AnyEndpoint> = Readonly<
    LazyRequestConfigFromEndpoint<E>
    & {
        skip?: boolean,
    }
>

export function useRequest<E extends AnyEndpoint>(
    endpoint: E,
    config?: RequestConfigFromEndpoint<E>,
) {
    invariant(
        endpoint.method !== Method.DELETE,
        `You cannot use useRequest with ${endpoint.method} method`
    );

    const [handler, state] = useLazyRequest(endpoint, config);
    const skip = React.useMemo(() => config?.skip ?? false, [config]);

    React.useEffect(
        () => {
            if (!skip) {
                handler({
                    force: false,
                });
            }
        },
        [skip, handler]
    );

    return state;
}
