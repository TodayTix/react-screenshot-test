/// <reference types="node" />
/**
 * A minimal implementation of fetch().
 *
 * We don't use Axios or any other library to reduce the chance of conflict with
 * mocks that a library user may have set up in their own project. See
 * https://github.com/fwouts/react-screenshot-test/issues/178#issuecomment-621194050
 * for a concrete example of this happening.
 */
export declare function fetch(url: string, method?: string, body?: any): Promise<{
    status: number;
    body: Buffer;
}>;
