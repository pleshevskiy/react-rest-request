import React from 'react';
import invariant from 'tiny-invariant';
import isEqual from 'lodash.isequal';
import { useClient } from './client-hook';
import { Endpoint } from './endpoint';
import { PublicRequestState, RequestAction, requestReducer, RequestState } from './reducer';
import { useRequestContext } from './request-context';

export type LazyRequestConfig<R, V, P = void> = Readonly<{
    variables?: V;
    params?: P;
    headers?: Record<string, string>;
    onComplete?: (data: R) => unknown;
}>

export type LazyRequestHandlerConfig<R, V, P> = Readonly<
    LazyRequestConfig<R, V, P>
    & { force?: boolean }
>

export type RequestHandler<R, V, P> = (config?: LazyRequestHandlerConfig<R, V, P>) => Promise<R | null>;

export function useLazyRequest<R = Record<string, any>, V = Record<string, any>, P = void>(
    endpoint: Endpoint<P>,
    config?: LazyRequestConfig<R, V, P>,
): [RequestHandler<R, V, P>, PublicRequestState<R>] {
    const [client] = useClient();
    const { defaultHeaders } = useRequestContext();
    const [state, dispatch] = React.useReducer<React.Reducer<RequestState<R>, RequestAction<R>>>(
        requestReducer,
        {
            data: null,
            loading: false,
            isCalled: false,
        }
    );

    const handler = React.useCallback(
        (handlerConfig?: LazyRequestHandlerConfig<R, V, P>) => {
            if (state?.loading) {
                return Promise.resolve(null);
            }

            let params: P | undefined;
            let endpointUrl: string;
            let isSameRequest = true;
            if (typeof endpoint.url === 'function') {
                params = handlerConfig?.params ?? config?.params;
                invariant(params, 'Endpoind required params');

                endpointUrl = endpoint.url(params);

                isSameRequest = !!state?.prevParams && isEqual(state.prevParams, params);
            } else {
                endpointUrl = endpoint.url;
            }

            const variables = {
                ...config?.variables,
                ...handlerConfig?.variables,
            };

            const headers = {
                ...defaultHeaders,
                ...endpoint.headers,
                ...config?.headers,
                ...handlerConfig?.headers,
            };

            if (
                isSameRequest
                && state?.prevVariables && isEqual(state.prevVariables, variables)
                && state?.prevHeaders && isEqual(state.prevHeaders, headers)
                && !handlerConfig?.force
            ) {
                return Promise.resolve(state.data);
            }

            const onComplete = config?.onComplete ?? handlerConfig?.onComplete;

            dispatch({ type: 'call', headers, variables, params });

            return client
                .request<R>({
                    ...endpoint,
                    url: endpointUrl,
                    headers,
                    variables,
                })
                .then(
                    (response) => {
                        dispatch({ type: 'success', response });
                        if (typeof onComplete === 'function') {
                            onComplete(response.data);
                        }
                        return response.data;
                    },
                    (response) => {
                        dispatch({ type: 'failure', response });
                        throw response;
                    }
                );
        },
        [state, config, client, endpoint, defaultHeaders]
    );

    return [
        handler,
        {
            data: state.data,
            loading: state.loading,
            isCalled: state.isCalled,
        },
    ];
}
