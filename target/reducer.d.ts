import { ClientResponse } from './client';
export declare type RequestState<R> = Readonly<{
    data: R | null;
    loading: boolean;
    isCalled: boolean;
    prevHeaders?: Record<string, string>;
    prevVariables?: Record<string, any>;
    prevParams?: Record<string, any>;
}>;
export declare type PublicRequestState<R> = Pick<RequestState<R>, 'data' | 'loading' | 'isCalled'>;
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
};
export declare function requestReducer<R>(state: RequestState<R>, action: RequestAction<R>): {
    loading: boolean;
    isCalled: boolean;
    prevHeaders: Record<string, string>;
    prevVariables: Record<string, any>;
    prevParams: Record<string, any> | undefined;
    data: R | null;
} | {
    loading: boolean;
    data: R;
    isCalled: boolean;
    prevHeaders?: Record<string, string> | undefined;
    prevVariables?: Record<string, any> | undefined;
    prevParams?: Record<string, any> | undefined;
} | {
    loading: boolean;
    data: null;
    isCalled: boolean;
    prevHeaders?: Record<string, string> | undefined;
    prevVariables?: Record<string, any> | undefined;
    prevParams?: Record<string, any> | undefined;
};
