
export function isObject(val: any): val is Record<string, unknown> {
    return Object.prototype.toString.call(val) === '[object Object]';
}

export function isFunction(val: any): val is (...args: any[]) => any {
    return typeof val === 'function';
}

export function formDataFromObject(obj: Record<string, any>) {
    const formData = new FormData();
    Object.entries(obj)
        .filter(([_, value]) => value !== undefined)
        .forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value
                    .filter(val => val !== undefined)
                    .forEach(val => formData.append(key, val));
            } else if (isObject(value)) {
                formData.set(key, JSON.stringify(value));
            } else {
                formData.set(key, value);
            }
        });

    return formData;
}

export function urlSearchParamsFromObject(obj: Record<string, any>) {
    const searchParams = new URLSearchParams();
    Object.entries(obj)
        .filter(([_, value]) => value !== undefined)
        .forEach(([key, value]) => {
            if (Array.isArray(value)) {
                const arrayKey = `${key}[]`;
                value
                    .filter(val => val !== undefined)
                    .forEach(val => searchParams.append(arrayKey, val));
            } else {
                searchParams.set(key, value);
            }
        });

    return searchParams;
}
