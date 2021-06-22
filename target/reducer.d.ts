/// <reference types="react" />
import { ClientResponse } from './client';
export interface PublicRequestState<R> {
    readonly data: R | null;
    readonly loading: boolean;
    readonly isCalled: boolean;
    readonly isCanceled?: boolean;
    readonly response?: ClientResponse<R>;
    readonly fetchError?: Error;
}
export interface RequestState<R> extends PublicRequestState<R> {
    readonly prevHeaders?: Record<string, string>;
    readonly prevVariables?: Record<string, any>;
    readonly prevParams?: Record<string, any>;
}
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
} | {
    type: 'clearStore';
};
export declare type RequestReducer<R> = React.Reducer<RequestState<R>, RequestAction<R>>;
export declare const INITIAL_REQUEST_STATE: RequestState<any>;
export declare function requestReducer<R>(state: RequestState<R>, action: RequestAction<R>): RequestState<R>;
