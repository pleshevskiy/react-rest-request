import React from 'react';
import invariant from 'tiny-invariant';


export type RequestContextData = Readonly<{
    baseUrl: string;
    defaultHeaders?: Record<string, string>;
}>

const RequestContext = React.createContext<RequestContextData | null>(null);

export type RequestProviderProps = Readonly<React.PropsWithChildren<RequestContextData>>

export function RequestProvider({ baseUrl, defaultHeaders, children }: RequestProviderProps) {
    return (
        <RequestContext.Provider value={{ baseUrl, defaultHeaders }}>
            {children}
        </RequestContext.Provider>
    );
}

export function useRequestContext() {
    const context = React.useContext(RequestContext);

    invariant(context, 'useRequestContext() must be a child of <RequestProvider />');

    return context;
}

