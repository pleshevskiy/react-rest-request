import React from 'react';
import invariant from 'tiny-invariant';
import { methodWithoutEffects } from './endpoint';
import { useLazyRequest } from './lazy_request_hook';
export function useRequest(endpoint, config) {
    invariant(methodWithoutEffects(endpoint.method), `You cannot use useRequest with ${endpoint.method} method`);
    const [handler, state] = useLazyRequest(endpoint, config);
    const skip = React.useMemo(() => { var _a; return (_a = config === null || config === void 0 ? void 0 : config.skip) !== null && _a !== void 0 ? _a : false; }, [config]);
    React.useEffect(() => {
        if (!skip) {
            handler();
        }
    }, [skip, handler]);
    return state;
}
