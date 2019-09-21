import Axios from 'axios';
import React from 'react';
import { useRequestContext } from './request-context';

export function useClient() {
    const { baseUrl } = useRequestContext();

    const client = React.useMemo(
        () => Axios.create({ baseURL: baseUrl }),
        [baseUrl]
    );

    return [client];
}
