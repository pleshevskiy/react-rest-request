import { Endpoint, ExtractEndpointParams, ExtractEndpointResponse, ExtractEndpointVariables } from './endpoint';
import { LazyRequestConfig } from './lazy-request-hook';
export declare type RequestConfig<R, V, P> = Readonly<LazyRequestConfig<R, V, P> & {
    skip?: boolean;
}>;
export declare function useRequest<E extends Endpoint<R, V, P>, R = ExtractEndpointResponse<E>, V = ExtractEndpointVariables<E>, P = ExtractEndpointParams<E>>(endpoint: E, config?: RequestConfig<R, V, P>): Pick<Readonly<{
    data: R | null;
    loading: boolean;
    isCalled: boolean;
    prevHeaders?: Record<string, string> | undefined;
    prevVariables?: Record<string, any> | undefined;
    prevParams?: Record<string, any> | undefined;
}>, "loading" | "data" | "isCalled">;
