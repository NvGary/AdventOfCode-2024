import { readFileByLine } from '../fs';

type Towels = {
    patterns: string[];
    designs: string[];
};

export const loadFromFile = (filename: string): Towels => {
    const patterns: string[] = [];
    const designs: string[] = [];

    readFileByLine(filename, line => {
        if (line.includes(',')) {
            patterns.push(...line.split(',').map(s => s.trim()));
        }
        else {
            designs.push(line);
        }
    });

    return { patterns, designs };
};

/**
 * Memoizes the input of the function and caches the results in a hash map.
 * Must be written like this to make it's scope global to the module
 * @param {*} func The function to cache the result of
 * @returns The result of the inputs
 */
const memoise = (func: Function): typeof func => {
    // Create a cache. Using a hash map is exponentially faster than a plain object
    const cache = new Map();

    return function r(this: unknown, ...args: never[]) {
        // Get the JSON string of the args
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
    };
};

const solve = memoise((design: Towels['designs'][number], patterns: Towels['patterns']): number => {
    let solutionCount = 0;

    for (let i = 0; i < patterns.length; ++i) {
        const pattern = patterns[i];

        if (design === pattern) {
            solutionCount++;
        }
        else if (design.startsWith(pattern)) {
            const remainingDesign = design.slice(pattern.length);
            solutionCount += solve(remainingDesign, patterns) as number;
        }
    }

    return solutionCount;
});

export const determineSolveable = ({ designs, patterns }: Towels): { design: Towels['designs'][number]; solutions: number }[] => {
    const solveable = designs.map(
        design => ({ design, solutions: solve(design, patterns.sort((a, b) => b.length - a.length)) })).filter(({ solutions }) => solutions);

    return solveable;
};
