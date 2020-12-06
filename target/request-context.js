import React from 'react';
import invariant from 'tiny-invariant';
const RequestContext = React.createContext(null);
export function RequestProvider({ client, defaultHeaders, children }) {
    return (React.createElement(RequestContext.Provider, { value: { client, defaultHeaders } }, children));
}
export function useRequestContext() {
    const context = React.useContext(RequestContext);
    invariant(context, 'useRequestContext() must be a child of <RequestProvider />');
    return context;
}
