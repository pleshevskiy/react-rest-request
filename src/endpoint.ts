
export enum Method {
    HEAD = 'HEAD',
    GET = 'GET',
    PUT = 'PUT',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

export type Endpoint<R, V, P = unknown> = Readonly<{
    _?: V; // Temporary hack to extract the type of variables. Do not use it in real endpoints.
    method: Method;
    url: string | ((params: P) => string);
    headers?: Record<string, string>;
    transformResponseData?: (data: any) => R;
}>

export type AnyEndpoint = Endpoint<any, any, any>

export type ExtractEndpointResponse<E> = E extends Endpoint<infer R, any, any> ? R : E extends Endpoint<infer R, any> ? R : never;
export type ExtractEndpointVariables<E> = E extends Endpoint<any, infer V, any> ? V : E extends Endpoint<any, infer V> ? V : never;
export type ExtractEndpointParams<E> = E extends Endpoint<any, any, infer P> ? P : never;
