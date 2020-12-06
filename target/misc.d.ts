export declare function isObject(val: any): val is Record<string, unknown>;
export declare function isFunction(val: any): val is (...args: any[]) => any;
export declare function formDataFromObject(obj: Record<string, any>): FormData;
export declare function urlSearchParamsFromObject(obj: Record<string, any>): URLSearchParams;
