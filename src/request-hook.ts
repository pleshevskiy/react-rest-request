import React from 'react';
import invariant from 'tiny-invariant';
import { Endpoint, Method } from './endpoint';
import { LazyRequestConfig, useLazyRequest } from './lazy-request-hook';

export type RequestConfig<R, V, P> = Readonly<
    LazyRequestConfig<R, V, P>
    & {
        skip?: boolean,
    }
>

export function useRequest<R = Record<string, any>, V = Record<string, any>, P = void>(
    endpoint: Endpoint<P>,
    config?: RequestConfig<R, V, P>,
) {
    invariant(
        endpoint.method == Method.GET,
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
