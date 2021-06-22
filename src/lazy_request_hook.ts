import React from 'react';
import invariant from 'tiny-invariant';
import isEqual from 'lodash.isequal';
import { useClient } from './client_hook';
import { AnyEndpoint, ExtractEndpointParams, ExtractEndpointResponse, ExtractEndpointVariables, methodWithoutEffects } from './endpoint';
import { INITIAL_REQUEST_STATE, PublicRequestState, RequestReducer, requestReducer } from './reducer';
import { useRequestContext } from './request_context';
import { ClientResponse } from './client';
import { isFunction } from './misc';

export interface LazyRequestConfig<R, V, P> {
    readonly variables?: V;
    readonly params?: P;
    readonly headers?: Record<string, string>;
    readonly onComplete?: (data: R) => unknown;
    readonly onFailure?: (res: ClientResponse<R>) => unknown;
}

export type LazyRequestConfigFromEndpoint<E extends AnyEndpoint> = LazyRequestConfig<
    ExtractEndpointResponse<E>,
    ExtractEndpointVariables<E>,
    ExtractEndpointParams<E>
>;

export interface LazyRequestHandlerConfig<E extends AnyEndpoint>
extends
    LazyRequestConfigFromEndpoint<E>
{
    readonly force?: boolean
}

export type RequestHandler<E extends AnyEndpoint> =
    (config?: LazyRequestHandlerConfig<E>) => Promise<ExtractEndpointResponse<E> | null>;

export interface PublicRequestStateWithActions<E extends AnyEndpoint> 
extends
    PublicRequestState<ExtractEndpointResponse<E>>
{
    readonly refetch: () => void,
    readonly cancel: () => void,
    readonly clearStore: () => void,
};

export function useLazyRequest<E extends AnyEndpoint>(
    endpoint: E,
    config?: LazyRequestConfigFromEndpoint<E>,
): [RequestHandler<E>, PublicRequestStateWithActions<E>] {
    const [client] = useClient();
    const { defaultHeaders } = useRequestContext();
    const [state, dispatch] = React.useReducer<RequestReducer<ExtractEndpointResponse<E>>>(
        requestReducer,
        INITIAL_REQUEST_STATE,
    );
    const [prevHandlerConfig, setPrevHandlerConfig] = React.useState<LazyRequestHandlerConfig<E> | null>(null);

    const abortControllerRef = React.useRef(new AbortController());

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
                invariant(params, 'Endpoint required params');

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

            const shouldReturnCachedValue = (
                methodWithoutEffects(endpoint.method)
                && state.isCalled
                && isSameRequest
                && state?.prevVariables && isEqual(state.prevVariables, variables)
                && state?.prevHeaders && isEqual(state.prevHeaders, headers)
                && !handlerConfig?.force
            );

            if (shouldReturnCachedValue) {
                return Promise.resolve(state.data);
            }

            const onCompletes = [config?.onComplete, handlerConfig?.onComplete].filter(isFunction);
            const onFailures = [config?.onFailure, handlerConfig?.onFailure].filter(isFunction);

            dispatch({ type: 'call', headers, variables, params });

            setPrevHandlerConfig(handlerConfig ?? {});

            return client
                .request<ExtractEndpointResponse<E>>({
                    ...endpoint,
                    abortSignal: abortControllerRef.current.signal,
                    url: endpointUrl,
                    headers,
                    variables,
                    transformResponseData,
                })
                .then(
                    (response) => {
                        dispatch({ type: 'success', response });

                        onCompletes.forEach(cb => cb(response.data));

                        return response.data;
                    },
                    (response: ClientResponse<ExtractEndpointResponse<E>>) => {
                        dispatch({ type: 'failure', response });

                        if (!response.canceled) {
                            onFailures.forEach(cb => cb(response));
                        }

                        return null;
                    }
                );
        },
        [state, config, client, endpoint, defaultHeaders, transformResponseData]
    );

    const refetchRequest = React.useCallback(
        () => {
            if (prevHandlerConfig != null) {
                handler({ ...prevHandlerConfig });
            }
        },
        [handler, prevHandlerConfig]
    );

    const cancelRequest = React.useCallback(() => {
        dispatch({ type: 'cancel' });
        abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
    }, []);

    const clearRequestStore = React.useCallback(() => {
        dispatch({ type: 'clearStore' });
    }, []);

    React.useEffect(
        () => cancelRequest,
        [cancelRequest]
    );

    return [
        handler,
        {
            data: state.data,
            loading: state.loading,
            isCalled: state.isCalled,
            isCanceled: state.isCanceled,
            fetchError: state.fetchError,
            refetch: refetchRequest,
            cancel: cancelRequest,
            clearStore: clearRequestStore
        },
    ];
}
