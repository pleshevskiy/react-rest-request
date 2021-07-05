"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLazyRequest = void 0;
const react_1 = require("react");
const tiny_invariant_1 = require("tiny-invariant");
const lodash_isequal_1 = require("lodash.isequal");
const client_hook_1 = require("./client_hook");
const endpoint_1 = require("./endpoint");
const reducer_1 = require("./reducer");
const request_context_1 = require("./request_context");
const misc_1 = require("./misc");
;
function useLazyRequest(endpoint, config) {
    const [client] = client_hook_1.useClient();
    const { defaultHeaders } = request_context_1.useRequestContext();
    const [state, dispatch] = react_1.default.useReducer(reducer_1.requestReducer, reducer_1.INITIAL_REQUEST_STATE);
    const [prevHandlerConfig, setPrevHandlerConfig] = react_1.default.useState(null);
    const abortControllerRef = react_1.default.useRef(new AbortController());
    const transformResponseData = react_1.default.useCallback((data) => {
        return misc_1.isFunction(endpoint.transformResponseData) ?
            endpoint.transformResponseData(data)
            : data;
    }, [endpoint]);
    const handler = react_1.default.useCallback((handlerConfig) => {
        var _a;
        if ((state === null || state === void 0 ? void 0 : state.loading) || (state === null || state === void 0 ? void 0 : state.isCanceled)) {
            return Promise.resolve(null);
        }
        let params;
        let endpointUrl;
        let isSameRequest = true;
        if (misc_1.isFunction(endpoint.url)) {
            params = (_a = handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.params) !== null && _a !== void 0 ? _a : config === null || config === void 0 ? void 0 : config.params;
            tiny_invariant_1.default(params, 'Endpoint required params');
            endpointUrl = endpoint.url(params);
            isSameRequest = !!(state === null || state === void 0 ? void 0 : state.prevParams) && lodash_isequal_1.default(state.prevParams, params);
        }
        else {
            endpointUrl = endpoint.url;
        }
        const variables = Object.assign(Object.assign({}, config === null || config === void 0 ? void 0 : config.variables), handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.variables);
        const headers = Object.assign(Object.assign(Object.assign(Object.assign({}, defaultHeaders), endpoint.headers), config === null || config === void 0 ? void 0 : config.headers), handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.headers);
        const shouldReturnCachedValue = (endpoint_1.methodWithoutEffects(endpoint.method)
            && state.isCalled
            && isSameRequest
            && (state === null || state === void 0 ? void 0 : state.prevVariables) && lodash_isequal_1.default(state.prevVariables, variables)
            && (state === null || state === void 0 ? void 0 : state.prevHeaders) && lodash_isequal_1.default(state.prevHeaders, headers)
            && !(handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.force));
        if (shouldReturnCachedValue) {
            return Promise.resolve(state.data);
        }
        const onCompletes = [config === null || config === void 0 ? void 0 : config.onComplete, handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.onComplete].filter(misc_1.isFunction);
        const onFailures = [config === null || config === void 0 ? void 0 : config.onFailure, handlerConfig === null || handlerConfig === void 0 ? void 0 : handlerConfig.onFailure].filter(misc_1.isFunction);
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
    const refetchRequest = react_1.default.useCallback(() => {
        if (prevHandlerConfig != null) {
            handler(Object.assign({}, prevHandlerConfig));
        }
    }, [handler, prevHandlerConfig]);
    const cancelRequest = react_1.default.useCallback(() => {
        dispatch({ type: 'cancel' });
        abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
    }, []);
    const clearRequestStore = react_1.default.useCallback(() => {
        dispatch({ type: 'clearStore' });
    }, []);
    react_1.default.useEffect(() => cancelRequest, [cancelRequest]);
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
exports.useLazyRequest = useLazyRequest;
