import React from 'react';
import invariant from 'tiny-invariant';
import { Client } from './client';


export type RequestContextData = Readonly<{
    client: Client;
    defaultHeaders?: Record<string, string>;
}>

const RequestContext = React.createContext<RequestContextData | null>(null);

export type RequestProviderProps = Readonly<React.PropsWithChildren<RequestContextData>>

export function RequestProvider({ client, defaultHeaders, children }: RequestProviderProps) {
    return (
        <RequestContext.Provider value={{ client, defaultHeaders }}>
            {children}
        </RequestContext.Provider>
    );
}

export function useRequestContext() {
    const context = React.useContext(RequestContext);

    invariant(context, 'useRequestContext() must be a child of <RequestProvider />');

    return context;
}

