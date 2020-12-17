import React from 'react';
import invariant from 'tiny-invariant';
import isEqual from 'lodash.isequal';
import { useClient } from './client-hook';
import { requestReducer } from './reducer';
import { useRequestContext } from './request-context';
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
    const transformResponseData = React.useCallback((data) => {
        return isFunction(endpoint.transformResponseData) ?
            endpoint.transformResponseData(data)
            : data;
    }, [endpoint]);
    const handler = React.useCallback((handlerConfig) => {
        var _a, _b, _c;
        if (state === null || state === void 0 ? void 0 : state.loading) {
            return Promise.resolve(null);
        }
        let params;
        let endpointUrl;
        let isSameRequest = true;
        if (isFunction(endpoint.url)) {
            params = (_a = handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.params) !== null && _a !== void 0 ? _a : config === null || config === void 0 ? void 0 : config.params;
            invariant(params, 'Endpoind required params');
            endpointUrl = endpoint.url(params);
            isSameRequest = !!(state === null || state === void 0 ? void 0 : state.prevParams) && isEqual(state.prevParams, params);
        }
        else {
            endpointUrl = endpoint.url;
        }
        const variables = Object.assign(Object.assign({}, config === null || config === void 0 ? void 0 : config.variables), handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.variables);
        const headers = Object.assign(Object.assign(Object.assign(Object.assign({}, defaultHeaders), endpoint.headers), config === null || config === void 0 ? void 0 : config.headers), handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.headers);
        if (isSameRequest
            && (state === null || state === void 0 ? void 0 : state.prevVariables) && isEqual(state.prevVariables, variables)
            && (state === null || state === void 0 ? void 0 : state.prevHeaders) && isEqual(state.prevHeaders, headers)
            && !(handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.force)) {
            return Promise.resolve(state.data);
        }
        const onComplete = (_b = handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.onComplete) !== null && _b !== void 0 ? _b : config === null || config === void 0 ? void 0 : config.onComplete;
        const onFailure = (_c = handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.onFailure) !== null && _c !== void 0 ? _c : config === null || config === void 0 ? void 0 : config.onFailure;
        dispatch({ type: 'call', headers, variables, params });
        setPrevHandlerConfig(handlerConfig !== null && handlerConfig !== void 0 ? handlerConfig : {});
        return client
            .request(Object.assign(Object.assign({}, endpoint), { url: endpointUrl, headers,
            variables,
            transformResponseData }))
            .then((response) => {
            dispatch({ type: 'success', response });
            if (isFunction(onComplete)) {
                onComplete(response.data);
            }
            return response.data;
        }, (response) => {
            dispatch({ type: 'failure', response });
            if (isFunction(onFailure)) {
                onFailure(response);
            }
            return null;
        });
    }, [state, config, client, endpoint, defaultHeaders, transformResponseData]);
    const refetch = React.useCallback(() => {
        if (prevHandlerConfig != null) {
            handler(Object.assign(Object.assign({}, prevHandlerConfig), { force: true }));
        }
    }, [handler, prevHandlerConfig]);
    return [
        handler,
        {
            data: state.data,
            loading: state.loading,
            isCalled: state.isCalled,
            refetch,
        },
    ];
}
