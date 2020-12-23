/// <reference types="react" />
import { ClientResponse } from './client';
export declare type PublicRequestState<R> = Readonly<{
    data: R | null;
    loading: boolean;
    isCalled: boolean;
    isCanceled?: boolean;
    error?: Error;
}>;
export declare type RequestState<R> = PublicRequestState<R> & Readonly<{
    prevHeaders?: Record<string, string>;
    prevVariables?: Record<string, any>;
    prevParams?: Record<string, any>;
}>;
export declare type RequestAction<R> = {
    type: 'call';
    headers: Record<string, string>;
    variables: Record<string, any>;
    params?: Record<string, any>;
} | {
    type: 'success';
    response: ClientResponse<R>;
} | {
    type: 'failure';
    response: ClientResponse<R>;
} | {
    type: 'cancel';
};
export declare type RequestReducer<R> = React.Reducer<RequestState<R>, RequestAction<R>>;
export declare function requestReducer<R>(state: RequestState<R>, action: RequestAction<R>): {
    loading: boolean;
    data: R;
    isCalled: boolean;
    isCanceled?: boolean | undefined;
    error?: Error | undefined;
    prevHeaders?: Record<string, string> | undefined;
    prevVariables?: Record<string, any> | undefined;
    prevParams?: Record<string, any> | undefined;
} | {
    loading: boolean;
    data: null;
    error: Error | undefined;
    isCanceled: boolean | undefined;
    isCalled: boolean;
    prevHeaders?: Record<string, string> | undefined;
    prevVariables?: Record<string, any> | undefined;
    prevParams?: Record<string, any> | undefined;
} | {
    isCanceled: boolean;
    error: undefined;
    data: R | null;
    loading: boolean;
    isCalled: boolean;
    prevHeaders?: Record<string, string> | undefined;
    prevVariables?: Record<string, any> | undefined;
    prevParams?: Record<string, any> | undefined;
};
