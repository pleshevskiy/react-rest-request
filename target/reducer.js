export function requestReducer(state, action) {
    switch (action.type) {
        case 'call': {
            return Object.assign(Object.assign({}, state), { loading: true, isCalled: true, prevHeaders: action.headers, prevVariables: action.variables, prevParams: action.params });
        }
        case 'success': {
            return Object.assign(Object.assign({}, state), { loading: false, data: action.response.data });
        }
        case 'failure': {
            return Object.assign(Object.assign({}, state), { loading: false, data: null });
        }
    }
}
