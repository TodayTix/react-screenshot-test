/// <reference types="jest" />
export declare function mocked<T extends (...args: any[]) => any>(f: T): jest.MockedFunction<T>;
