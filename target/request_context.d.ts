import React from 'react';
import { Client } from './client';
export interface RequestContextData {
    readonly client: Client;
    readonly defaultHeaders?: Record<string, string>;
}
export declare type RequestProviderProps = Readonly<React.PropsWithChildren<RequestContextData>>;
export declare function RequestProvider({ client, defaultHeaders, children }: RequestProviderProps): JSX.Element;
export declare function useRequestContext(): RequestContextData;
