"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRequestContext = exports.RequestProvider = void 0;
const react_1 = require("react");
const tiny_invariant_1 = require("tiny-invariant");
const RequestContext = react_1.default.createContext(null);
function RequestProvider({ client, defaultHeaders, children }) {
    return (react_1.default.createElement(RequestContext.Provider, { value: { client, defaultHeaders } }, children));
}
exports.RequestProvider = RequestProvider;
function useRequestContext() {
    const context = react_1.default.useContext(RequestContext);
    tiny_invariant_1.default(context, 'useRequestContext() must be a child of <RequestProvider />');
    return context;
}
exports.useRequestContext = useRequestContext;
