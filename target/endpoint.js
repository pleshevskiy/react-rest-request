"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodWithoutEffects = exports.methodCanContainBody = exports.Method = void 0;
var Method;
(function (Method) {
    Method["HEAD"] = "HEAD";
    Method["GET"] = "GET";
    Method["PUT"] = "PUT";
    Method["POST"] = "POST";
    Method["PATCH"] = "PATCH";
    Method["DELETE"] = "DELETE";
})(Method = exports.Method || (exports.Method = {}));
function methodCanContainBody(method) {
    return [Method.POST, Method.PATCH, Method.PUT].includes(method);
}
exports.methodCanContainBody = methodCanContainBody;
function methodWithoutEffects(method) {
    return [Method.HEAD, Method.GET].includes(method);
}
exports.methodWithoutEffects = methodWithoutEffects;
