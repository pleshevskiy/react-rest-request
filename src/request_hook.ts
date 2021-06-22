import React from 'react';
import invariant from 'tiny-invariant';
import { AnyEndpoint, methodWithoutEffects } from './endpoint';
import { LazyRequestConfigFromEndpoint, useLazyRequest } from './lazy_request_hook';

export interface RequestConfigFromEndpoint<E extends AnyEndpoint> 
extends
    LazyRequestConfigFromEndpoint<E>
{
    readonly skip?: boolean,
}

export function useRequest<E extends AnyEndpoint>(
    endpoint: E,
    config?: RequestConfigFromEndpoint<E>,
) {
    invariant(
        methodWithoutEffects(endpoint.method),
        `You cannot use useRequest with ${endpoint.method} method`
    );

    const [handler, state] = useLazyRequest(endpoint, config);
    const skip = React.useMemo(() => config?.skip ?? false, [config]);

    React.useEffect(
        () => {
            if (!skip) {
                handler();
            }
        },
        [skip, handler]
    );

    return state;
}
