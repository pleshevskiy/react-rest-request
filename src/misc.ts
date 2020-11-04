
export function isObject(val: any) {
    return Object.prototype.toString.call(val) === '[object Object]';
}

export function formDataFromObject(obj: Record<string, any>) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            value.forEach(val => formData.append(key, val));
        } else if (isObject(value)) {
            formData.set(key, JSON.stringify(value));
        } else {
            formData.set(key, value);
        }
    }

    return formData;
}

export function urlSearchParamsFromObject(obj: Record<string, any>) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            const arrayKey = `${key}[]`;
            value.forEach(val => searchParams.append(arrayKey, val));
        } else {
            searchParams.set(key, value);
        }
    }

    return searchParams;
}
