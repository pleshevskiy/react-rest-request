export var Method;
(function (Method) {
    Method["HEAD"] = "HEAD";
    Method["GET"] = "GET";
    Method["PUT"] = "PUT";
    Method["POST"] = "POST";
    Method["PATCH"] = "PATCH";
    Method["DELETE"] = "DELETE";
})(Method || (Method = {}));
export function methodCanContainBody(method) {
    return [Method.POST, Method.PATCH, Method.PUT].includes(method);
}
export function methodWithoutEffects(method) {
    return [Method.HEAD, Method.GET].includes(method);
}
