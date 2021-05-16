import { useRequestContext } from './request_context';

export function useClient() {
    const { client } = useRequestContext();

    return [client];
}
