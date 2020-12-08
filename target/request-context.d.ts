import React from 'react';
import { Client } from './client';
export declare type RequestContextData = Readonly<{
    client: Client;
    defaultHeaders?: Record<string, string>;
}>;
export declare type RequestProviderProps = Readonly<React.PropsWithChildren<RequestContextData>>;
export declare function RequestProvider({ client, defaultHeaders, children }: RequestProviderProps): JSX.Element;
export declare function useRequestContext(): Readonly<{
    client: Client;
    defaultHeaders?: Record<string, string> | undefined;
}>;
