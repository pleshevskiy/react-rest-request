"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClient = void 0;
const request_context_1 = require("./request_context");
function useClient() {
    const { client } = request_context_1.useRequestContext();
    return [client];
}
exports.useClient = useClient;
