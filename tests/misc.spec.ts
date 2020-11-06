import { formDataFromObject, isObject, urlSearchParamsFromObject } from '../src/misc';

describe('misc', () => {
    describe('isObject', () => {
        it('should return thruthy successfully', () => {
            expect(isObject({})).toBeTruthy();
        });

        it('should return falsy', () => {
            expect(isObject(1)).toBeFalsy();
            expect(isObject(true)).toBeFalsy();
            expect(isObject('')).toBeFalsy();
            expect(isObject([])).toBeFalsy();
            expect(isObject(function () { return null; })).toBeFalsy();
            expect(isObject(null)).toBeFalsy();
            expect(isObject(undefined)).toBeFalsy();
            expect(isObject(NaN)).toBeFalsy();
            expect(isObject(Infinity)).toBeFalsy();
        });
    });

    describe('formDataFromObject', () => {
        it('should convert object to form data successfully', () => {
            const formData = formDataFromObject({
                id: 1,
                name: 'John',
                status: ['ACTIVE', 'NOT_ACTIVE'],
                user: {
                    name: 'John'
                }
            });

            expect(formData).toBeInstanceOf(FormData);
            expect(formData.get('id')).toBe('1');
            expect(formData.get('name')).toBe('John');
            expect(formData.getAll('status')).toEqual(['ACTIVE', 'NOT_ACTIVE']);
            expect(formData.get('user')).toBe('{"name":"John"}');
        });

        it('should filter undefined values successfully', () => {
            const formData = formDataFromObject({
                id: undefined,
                status: [undefined],
            });

            expect(formData.has('id')).toBeFalsy();
            expect(formData.has('status')).toBeFalsy();
        });
    });

    describe('urlSearchParamsFromObject', () => {
        it('should convert object to search params successfully', () => {
            const searchParams = urlSearchParamsFromObject({
                id: 1,
                name: 'John',
                status: ['ACTIVE', 'NOT_ACTIVE']
            });

            expect(searchParams).toBeInstanceOf(URLSearchParams);
            expect(searchParams.toString()).toBe('id=1&name=John&status%5B%5D=ACTIVE&status%5B%5D=NOT_ACTIVE');
        });

        it('should encode value as uri component successfully', () => {
            const searchParams = urlSearchParamsFromObject({
                name: '@',
            });

            expect(searchParams.toString()).toBe('name=%40');
        });

        it('should filter undefined values successfully', () => {
            const searchParams = urlSearchParamsFromObject({
                id: 1,
                name: undefined,
                status: ['ACTIVE', undefined],
            });

            expect(searchParams.toString()).toBe('id=1&status%5B%5D=ACTIVE');
        });
    });
});