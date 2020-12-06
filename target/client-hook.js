import { useRequestContext } from './request-context';
export function useClient() {
    const { client } = useRequestContext();
    return [client];
}
