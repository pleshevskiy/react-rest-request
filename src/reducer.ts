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

export type RequestAction<R> =
    | {
        type: 'call',
        headers: Record<string, string>,
        variables: Record<string, any>,
        params?: Record<string, any>
    }
    | {
        type: 'success',
        response: ClientResponse<R>
    }
    | {
        type: 'failure',
        response: ClientResponse<R>
    }
    | {
        type: 'cancel'
    }
    | {
        type: 'clearStore'
    }

export type RequestReducer<R> = React.Reducer<RequestState<R>, RequestAction<R>>

export const INITIAL_REQUEST_STATE: RequestState<any> = {
    data: null,
    response: undefined,
    fetchError: undefined,
    isCanceled: false,
    loading: false,
    isCalled: false,
    prevHeaders: undefined,
    prevVariables: undefined,
    prevParams: undefined,
};

export function requestReducer<R>(state: RequestState<R>, action: RequestAction<R>): RequestState<R> {
    switch (action.type) {
        case 'call': {
            return {
                ...state,
                response: undefined,
                fetchError: undefined,
                isCanceled: false,
                loading: true,
                isCalled: true,
                prevHeaders: action.headers,
                prevVariables: action.variables,
                prevParams: action.params,
            };
        }
        case 'success': {
            return {
                ...state,
                loading: false,
                response: action.response,
                data: action.response.data,
            };
        }
        case 'failure': {
            return {
                ...state,
                loading: false,
                response: action.response,
                data: null,
                fetchError: action.response.error,
                isCanceled: action.response.canceled,
            };
        }
        case 'cancel': {
            return {
                ...state,
                isCanceled: true,
                fetchError: undefined,
            };
        }
        case 'clearStore': {
            return INITIAL_REQUEST_STATE;
        }
    }
}

