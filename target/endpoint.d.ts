export declare enum Method {
    HEAD = "HEAD",
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    PATCH = "PATCH",
    DELETE = "DELETE"
}
export declare type Endpoint<R, _V, P = never> = Readonly<{
    method: Method;
    url: string | ((params: P) => string);
    headers?: Record<string, string>;
    transformResponseData?: (data: any) => R;
}>;
export declare type ExtractEndpointResponse<E> = E extends Endpoint<infer R, any, any> ? R : E extends Endpoint<infer R, any> ? R : never;
export declare type ExtractEndpointVariables<E> = E extends Endpoint<any, infer V, any> ? V : E extends Endpoint<any, infer V> ? V : never;
export declare type ExtractEndpointParams<E> = E extends Endpoint<any, any, infer P> ? P : never;
