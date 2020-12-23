import { ClientResponse } from './client';

export type PublicRequestState<R> = Readonly<{
    data: R | null;
    loading: boolean;
    isCalled: boolean;
    isCanceled?: boolean;
    error?: Error;
}>;

export type RequestState<R> = PublicRequestState<R> & Readonly<{
    prevHeaders?: Record<string, string>;
    prevVariables?: Record<string, any>;
    prevParams?: Record<string, any>;
}>

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

export type RequestReducer<R> = React.Reducer<RequestState<R>, RequestAction<R>>

export function requestReducer<R>(state: RequestState<R>, action: RequestAction<R>) {
    switch (action.type) {
        case 'call': {
            return {
                ...state,
                error: undefined,
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
                data: action.response.data,
            };
        }
        case 'failure': {
            return {
                ...state,
                loading: false,
                data: null,
                error: action.response.error,
                isCanceled: action.response.canceled,
            };
        }
        case 'cancel': {
            return {
                ...state,
                isCanceled: false,
                error: undefined,
            };
        }
    }
}