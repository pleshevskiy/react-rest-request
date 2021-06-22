export const INITIAL_REQUEST_STATE = {
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
export function requestReducer(state, action) {
    switch (action.type) {
        case 'call': {
            return Object.assign(Object.assign({}, state), { response: undefined, fetchError: undefined, isCanceled: false, loading: true, isCalled: true, prevHeaders: action.headers, prevVariables: action.variables, prevParams: action.params });
        }
        case 'success': {
            return Object.assign(Object.assign({}, state), { loading: false, response: action.response, data: action.response.data });
        }
        case 'failure': {
            return Object.assign(Object.assign({}, state), { loading: false, response: action.response, data: null, fetchError: action.response.error, isCanceled: action.response.canceled });
        }
        case 'cancel': {
            return Object.assign(Object.assign({}, state), { isCanceled: true, fetchError: undefined });
        }
        case 'clearStore': {
            return INITIAL_REQUEST_STATE;
        }
    }
}
