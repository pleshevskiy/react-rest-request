var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import invariant from 'tiny-invariant';
import { Method } from './endpoint';
import { formDataFromObject, isFunction, urlSearchParamsFromObject } from './misc';
export class Client {
    constructor(config) {
        this.config = config;
    }
    prepareRequest(props) {
        var _a;
        const requestCanContainBody = [Method.POST, Method.PATCH, Method.PUT].includes(props.method);
        const defaultBaseUrl = (_a = window) === null || _a === void 0 ? void 0 : _a.location.href;
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
        const body = !requestCanContainBody ? (undefined) : contentType === 'application/json' ? (JSON.stringify(props.variables)) : contentType === 'multipart/form-data' ? (props.variables instanceof FormData ? (props.variables) : (formDataFromObject(props.variables))) : (
        /* TODO: need to add more content-type of body */
        undefined);
        return new Request(url.toString(), {
            headers,
            method: props.method,
            body,
        });
    }
    request(_a) {
        var { transformResponseData, abortSignal } = _a, restProps = __rest(_a, ["transformResponseData", "abortSignal"]);
        const req = this.prepareRequest(restProps);
        return fetch(req, { signal: abortSignal })
            // TODO: need to check response headers and parse json only if content-type header is application/json
            .then((res) => Promise.all([res, res.json()]), (err) => {
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
                },
                {}
            ]);
        })
            .then(([res, data]) => {
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
}
