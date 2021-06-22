import React from 'react';
import invariant from 'tiny-invariant';
import isEqual from 'lodash.isequal';
import { useClient } from './client_hook';
import { requestReducer } from './reducer';
import { useRequestContext } from './request_context';
import { isFunction } from './misc';
export function useLazyRequest(endpoint, config) {
    const [client] = useClient();
    const { defaultHeaders } = useRequestContext();
    const [state, dispatch] = React.useReducer(requestReducer, {
        data: null,
        loading: false,
        isCalled: false,
    });
    const [prevHandlerConfig, setPrevHandlerConfig] = React.useState(null);
    const abortControllerRef = React.useRef(new AbortController());
    const transformResponseData = React.useCallback((data) => {
        return isFunction(endpoint.transformResponseData) ?
            endpoint.transformResponseData(data)
            : data;
    }, [endpoint]);
    const handler = React.useCallback((handlerConfig) => {
        var _a;
        if ((state === null || state === void 0 ? void 0 : state.loading) || (state === null || state === void 0 ? void 0 : state.isCanceled)) {
            return Promise.resolve(null);
        }
        let params;
        let endpointUrl;
        let isSameRequest = true;
        if (isFunction(endpoint.url)) {
            params = (_a = handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.params) !== null && _a !== void 0 ? _a : config === null || config === void 0 ? void 0 : config.params;
            invariant(params, 'Endpoint required params');
            endpointUrl = endpoint.url(params);
            isSameRequest = !!(state === null || state === void 0 ? void 0 : state.prevParams) && isEqual(state.prevParams, params);
        }
        else {
            endpointUrl = endpoint.url;
        }
        const variables = Object.assign(Object.assign({}, config === null || config === void 0 ? void 0 : config.variables), handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.variables);
        const headers = Object.assign(Object.assign(Object.assign(Object.assign({}, defaultHeaders), endpoint.headers), config === null || config === void 0 ? void 0 : config.headers), handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.headers);
        if (state.isCalled
            && isSameRequest
            && (state === null || state === void 0 ? void 0 : state.prevVariables) && isEqual(state.prevVariables, variables)
            && (state === null || state === void 0 ? void 0 : state.prevHeaders) && isEqual(state.prevHeaders, headers)
            && (handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.force) === false) {
            return Promise.resolve(state.data);
        }
        const onCompletes = [config === null || config === void 0 ? void 0 : config.onComplete, handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.onComplete].filter(isFunction);
        const onFailures = [config === null || config === void 0 ? void 0 : config.onFailure, handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.onFailure].filter(isFunction);
        dispatch({ type: 'call', headers, variables, params });
        setPrevHandlerConfig(handlerConfig !== null && handlerConfig !== void 0 ? handlerConfig : {});
        return client
            .request(Object.assign(Object.assign({}, endpoint), { abortSignal: abortControllerRef.current.signal, url: endpointUrl, headers,
            variables,
            transformResponseData }))
            .then((response) => {
            dispatch({ type: 'success', response });
            onCompletes.forEach(cb => cb(response.data));
            return response.data;
        }, (response) => {
            dispatch({ type: 'failure', response });
            if (!response.canceled) {
                onFailures.forEach(cb => cb(response));
            }
            return null;
        });
    }, [state, config, client, endpoint, defaultHeaders, transformResponseData]);
    const refetchRequest = React.useCallback(() => {
        if (prevHandlerConfig != null) {
            handler(Object.assign(Object.assign({}, prevHandlerConfig), { force: true }));
        }
    }, [handler, prevHandlerConfig]);
    const cancelRequest = React.useCallback(() => {
        dispatch({ type: 'cancel' });
        abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
    }, []);
    React.useEffect(() => cancelRequest, [cancelRequest]);
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
        },
    ];
}
