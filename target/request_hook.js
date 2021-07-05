"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRequest = void 0;
const react_1 = require("react");
const tiny_invariant_1 = require("tiny-invariant");
const endpoint_1 = require("./endpoint");
const lazy_request_hook_1 = require("./lazy_request_hook");
function useRequest(endpoint, config) {
    tiny_invariant_1.default(endpoint_1.methodWithoutEffects(endpoint.method), `You cannot use useRequest with ${endpoint.method} method`);
    const [handler, state] = lazy_request_hook_1.useLazyRequest(endpoint, config);
    const skip = react_1.default.useMemo(() => { var _a; return (_a = config === null || config === void 0 ? void 0 : config.skip) !== null && _a !== void 0 ? _a : false; }, [config]);
    react_1.default.useEffect(() => {
        if (!skip) {
            handler();
        }
    }, [skip, handler]);
    return state;
}
exports.useRequest = useRequest;
