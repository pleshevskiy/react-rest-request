import invariant from 'tiny-invariant';
import { Method } from './endpoint';
import { formDataFromObject, isFunction, urlSearchParamsFromObject } from './misc';

export type ClientConfig = {
    baseUrl: string,
}

type PrepareRequestProps = {
    url: string,
    method: Method,
    headers: Record<string, string>,
    variables: Record<string, any> | FormData,
}

export type RequestProps<R> = PrepareRequestProps & {
    transformResponseData?: (data: unknown) => R,
}

export type ClientResponse<Data extends Record<string, any>> = Readonly<
    Pick<Response, 'ok' | 'redirected' | 'status' | 'statusText' | 'type' | 'headers' | 'url'>
    & { data: Data }
>

export class Client {
    constructor(private config: ClientConfig) {}

    public prepareRequest(props: PrepareRequestProps) {
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

    public request<Data extends Record<string, any>>(
        {
            transformResponseData,
            ...restProps
        }: RequestProps<Data>
    ): Promise<ClientResponse<Data>> {
        const req = this.prepareRequest(restProps);

        return fetch(req)
            // TODO: need to check response headers and parse json only if content-type header is application/json
            .then(res => Promise.all([res, res.json(), false]))
            .then(([res, data]) => {
                return {
                    ok: res.ok,
                    redirected: res.redirected,
                    status: res.status,
                    statusText: res.statusText,
                    type: res.type,
                    headers: res.headers,
                    url: res.url,
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
}
