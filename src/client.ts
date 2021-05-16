import invariant from 'tiny-invariant';
import { Method } from './endpoint';
import { formDataFromObject, isFunction, urlSearchParamsFromObject } from './misc';

export interface ClientConfig {
    baseUrl: string,
}

export interface PrepareRequestProps {
    url: string,
    method: Method,
    headers: Record<string, string>,
    variables: Record<string, any> | FormData,
}

export type RequestProps<R> = PrepareRequestProps & {
    transformResponseData?: (data: unknown) => R,
}

export type ResponseWithError =
    Pick<Response, 'ok' | 'redirected' | 'status' | 'statusText' | 'type' | 'headers' | 'url'>
    & Readonly<{ error?: Error, canceled?: boolean }>

export type ClientResponse<Data extends Record<string, any>> =
    ResponseWithError
    & Readonly<{ data: Data }>

export class Client {
    private controller = new AbortController();

    constructor(private readonly config: ClientConfig) {}

    prepareRequest(props: PrepareRequestProps) {
        const requestCanContainBody = [Method.POST, Method.PATCH, Method.PUT].includes(props.method);

        const defaultBaseUrl = (window as Window | undefined)?.location.href;
        const sourceUrl = /https?:\/\//.test(props.url) ?
            props.url
            : this.config.baseUrl + props.url;
        if (!defaultBaseUrl && sourceUrl.startsWith('/')) {
            throw new Error(`Invalid request method: ${sourceUrl}`);
        }

        const url = new URL(sourceUrl, defaultBaseUrl);
        if (!requestCanContainBody) {
            invariant(!(props.variables instanceof FormData), `Method ${props.method} cannot contain body`);

            url.search = urlSearchParamsFromObject(props.variables).toString();
        }

        const headers = new Headers(props.headers);
        if (requestCanContainBody && !headers.has('content-type')) {
            headers.set('content-type', 'application/json');
        }

        const contentType = headers.get('content-type');
        const body = !requestCanContainBody ? (
            undefined
        ) : contentType === 'application/json' ? (
            JSON.stringify(props.variables)
        ) : contentType === 'multipart/form-data' ? (
            props.variables instanceof FormData ? (
                props.variables
            ) : (
                formDataFromObject(props.variables)
            )
        ) : (
            /* TODO: need to add more content-type of body */
            undefined 
        );

        return new Request(
            url.toString(),
            {
                headers,
                method: props.method,
                body,
            }
        );
    }

    request<Data extends Record<string, any>>(
        {
            transformResponseData,
            ...restProps
        }: RequestProps<Data>
    ): Promise<ClientResponse<Data>> {
        const req = this.prepareRequest(restProps);

        return fetch(req, { signal: this.controller.signal })
            // TODO: need to check response headers and parse json only if content-type header is application/json
            .then(
                (res) => Promise.all([res, res.json()]),
                (err) => {
                    const canceled = err.name === 'AbortError';
                    return Promise.all([
                        {
                            ok: false,
                            redirected: false,
                            status: canceled ? 499 : 400,
                            statusText: canceled ? 'Client Closed Request' : err.toString(),
                            type: 'basic',
                            headers: {},
                            url: req.url,
                            error: err,
                            canceled,
                        } as ResponseWithError,
                        {}
                    ]);
                }
            )
            .then(([res, data]): ClientResponse<Data> => {
                return {
                    ok: res.ok,
                    redirected: res.redirected,
                    status: res.status,
                    statusText: res.statusText,
                    type: res.type,
                    headers: res.headers,
                    url: res.url,
                    error: 'error' in res ? res.error : undefined,
                    canceled: 'canceled' in res ? res.canceled : false,
                    data: isFunction(transformResponseData) ? transformResponseData(data) : data,
                };
            })
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }

                return res;
            });
    }

    cancelRequest() {
        this.controller.abort();
        this.controller = new AbortController();
    }
}
