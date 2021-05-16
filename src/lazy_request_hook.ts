import React from 'react';
import invariant from 'tiny-invariant';
import isEqual from 'lodash.isequal';
import { useClient } from './client_hook';
import { AnyEndpoint, ExtractEndpointParams, ExtractEndpointResponse, ExtractEndpointVariables } from './endpoint';
import { PublicRequestState, RequestReducer, requestReducer } from './reducer';
import { useRequestContext } from './request_context';
import { ClientResponse } from './client';
import { isFunction } from './misc';

export type LazyRequestConfig<R, V, P> = Readonly<{
    variables?: V;
    params?: P;
    headers?: Record<string, string>;
    onComplete?: (data: R) => unknown;
    onFailure?: (res: ClientResponse<R>) => unknown;
}>

export type LazyRequestConfigFromEndpoint<E extends AnyEndpoint> = LazyRequestConfig<
    ExtractEndpointResponse<E>,
    ExtractEndpointVariables<E>,
    ExtractEndpointParams<E>
>;

export type LazyRequestHandlerConfig<E extends AnyEndpoint> = Readonly<
    LazyRequestConfigFromEndpoint<E>
    & { force?: boolean }
>

export type RequestHandler<E extends AnyEndpoint> =
    (config?: LazyRequestHandlerConfig<E>) => Promise<ExtractEndpointResponse<E> | null>;

export type PublicRequestStateWithActions<E extends AnyEndpoint> =
    PublicRequestState<ExtractEndpointResponse<E>>
    & {
        refetch: () => void,
        cancel: () => void,
    };

export function useLazyRequest<E extends AnyEndpoint>(
    endpoint: E,
    config?: LazyRequestConfigFromEndpoint<E>,
): [RequestHandler<E>, PublicRequestStateWithActions<E>] {
    const [client] = useClient();
    const { defaultHeaders } = useRequestContext();
    const [state, dispatch] = React.useReducer<RequestReducer<ExtractEndpointResponse<E>>>(
        requestReducer,
        {
            data: null,
            loading: false,
            isCalled: false,
        }
    );
    const [prevHandlerConfig, setPrevHandlerConfig] = React.useState<LazyRequestHandlerConfig<E> | null>(null);

    const transformResponseData = React.useCallback(
        (data: unknown): ExtractEndpointResponse<E> => {
            return isFunction(endpoint.transformResponseData) ?
                endpoint.transformResponseData(data)
                : data as ExtractEndpointResponse<E>;
        },
        [endpoint]
    );

    const handler = React.useCallback(
        (handlerConfig?: LazyRequestHandlerConfig<E>) => {
            if (state?.loading || state?.isCanceled) {
                return Promise.resolve(null);
            }

            let params: ExtractEndpointParams<E> | undefined;
            let endpointUrl: string;
            let isSameRequest = true;
            if (isFunction(endpoint.url)) {
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
                state.isCalled
                && isSameRequest
                && state?.prevVariables && isEqual(state.prevVariables, variables)
                && state?.prevHeaders && isEqual(state.prevHeaders, headers)
                && !handlerConfig?.force
            ) {
                return Promise.resolve(state.data);
            }

            const onComplete = handlerConfig?.onComplete ?? config?.onComplete;
            const onFailure = handlerConfig?.onFailure ?? config?.onFailure;

            dispatch({ type: 'call', headers, variables, params });

            setPrevHandlerConfig(handlerConfig ?? {});

            return client
                .request<ExtractEndpointResponse<E>>({
                    ...endpoint,
                    url: endpointUrl,
                    headers,
                    variables,
                    transformResponseData,
                })
                .then(
                    (response) => {
                        dispatch({ type: 'success', response });

                        if (isFunction(onComplete)) {
                            onComplete(response.data);
                        }

                        return response.data;
                    },
                    (response: ClientResponse<ExtractEndpointResponse<E>>) => {
                        dispatch({ type: 'failure', response });

                        if (!response.canceled && isFunction(onFailure)) {
                            onFailure(response);
                        }

                        return null;
                    }
                );
        },
        [state, config, client, endpoint, defaultHeaders, transformResponseData]
    );

    const refetch = React.useCallback(
        () => {
            if (prevHandlerConfig != null) {
                handler({
                    ...prevHandlerConfig,
                    force: true,
                });
            }
        },
        [handler, prevHandlerConfig]
    );

    React.useEffect(
        () => {
            return () => {
                dispatch({ type: 'cancel' });
                client.cancelRequest();
            };
        },
        [client]
    );

    return [
        handler,
        {
            data: state.data,
            loading: state.loading,
            isCalled: state.isCalled,
            isCanceled: state.isCanceled,
            error: state.error,
            refetch,
            cancel: client.cancelRequest.bind(client),
        },
    ];
}
