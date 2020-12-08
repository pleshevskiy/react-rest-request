import { Endpoint } from './endpoint';
import { LazyRequestConfig } from './lazy-request-hook';
export declare type RequestConfig<R, V, P> = Readonly<LazyRequestConfig<R, V, P> & {
    skip?: boolean;
}>;
export declare function useRequest<R = Record<string, any>, V = Record<string, any>, P = void>(endpoint: Endpoint<R, V, P>, config?: RequestConfig<R, V, P>): Pick<Readonly<{
    data: R | null;
    loading: boolean;
    isCalled: boolean;
    prevHeaders?: Record<string, string> | undefined;
    prevVariables?: Record<string, any> | undefined;
    prevParams?: Record<string, any> | undefined;
}>, "loading" | "data" | "isCalled">;
