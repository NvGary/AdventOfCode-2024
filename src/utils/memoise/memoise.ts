/**
 * Memoizes the input of the function and caches the results in a hash map.
 * Must be written like this to make it's scope global to the module
 * @param {T} func The function to cache the result of
 * @returns The result of the inputs
 */
export const memoise = <T extends (...args: never[]) => unknown>(func: T): T => {
    // Create a cache. Using a hash map is exponentially faster than a plain object
    const cache = new Map();

    return function r(this: unknown, ...args: never[]) {
        const [key] = args;

        // Check if this value has been cached and return it if found
        if (cache.has(key)) {
            return cache.get(key);
        }

        // Otherwise run function and get the result to cache
        // eslint-disable-next-line no-invalid-this
        const result = func.apply(this, args);
        cache.set(key, result);

        return result;
    } as T;
};
