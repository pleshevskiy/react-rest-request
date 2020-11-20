
export enum Method {
    HEAD = 'HEAD',
    GET = 'GET',
    PUT = 'PUT',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

export type Endpoint<R, V, P = void> = Readonly<{
    method: Method;
    url: string | ((params: P) => string);
    headers?: Record<string, string>;
    transformResponseData?: (data: any) => R;
}>
