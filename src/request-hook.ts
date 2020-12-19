import React from 'react';
import invariant from 'tiny-invariant';
import { Endpoint, ExtractEndpointParams, ExtractEndpointResponse, ExtractEndpointVariables, Method } from './endpoint';
import { LazyRequestConfig, useLazyRequest } from './lazy-request-hook';

export type RequestConfig<R, V, P> = Readonly<
    LazyRequestConfig<R, V, P>
    & {
        skip?: boolean,
    }
>

export function useRequest<
    E extends Endpoint<R, V, P>,
    R = ExtractEndpointResponse<E>,
    V = ExtractEndpointVariables<E>,
    P = ExtractEndpointParams<E>
>(
    endpoint: E,
    config?: RequestConfig<R, V, P>,
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
                handler();
            }
        },
        [skip, handler]
    );

    return state;
}
