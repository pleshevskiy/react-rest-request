export declare enum Method {
    HEAD = "HEAD",
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    PATCH = "PATCH",
    DELETE = "DELETE"
}
export declare type Endpoint<R, V, P = unknown> = Readonly<{
    _?: V;
    method: Method;
    url: string | ((params: P) => string);
    headers?: Record<string, string>;
    transformResponseData?: (data: any) => R;
}>;
export declare type AnyEndpoint = Endpoint<any, any, any>;
export declare type ExtractEndpointResponse<E> = E extends Endpoint<infer R, any, any> ? R : E extends Endpoint<infer R, any> ? R : never;
export declare type ExtractEndpointVariables<E> = E extends Endpoint<any, infer V, any> ? V : E extends Endpoint<any, infer V> ? V : never;
export declare type ExtractEndpointParams<E> = E extends Endpoint<any, any, infer P> ? P : never;
