import { Coords, StringArray2D } from '../array2d';
import { distance } from '../array2d/array2d';
import { Legend, type Options as MazeOptions, StepPriorityMaze } from '../maze';
import { coordsToString } from '../test/utils';

export const loadFromFile = (filename: string): StringArray2D => new StringArray2D().loadFromFile(filename);

export const solveAsMaze = (racetrack: StringArray2D, mazeOptions?: MazeOptions): ReturnType<typeof maze.solve>[number] | null => {
    const maze = new StepPriorityMaze(racetrack);

    const solutions = maze.solve({ ...mazeOptions });

    if (solutions.length) {
        return solutions.sort(({ cost: { steps: a } }, { cost: { steps: b } }) => a - b)[0];
    }

    return null;
};

type ShortcutData = { start: Coords; end: Coords };

type Shortcut = {
    coords: ShortcutData;
    saving: number;
};

const getPossibleShortcuts = (racetrack: StringArray2D, pos: Coords, maxLength: number): ShortcutData[] => {
    // To be a shortcut we must traverse through 1 wall and come out the other side
    // const shortcuts: ShortcutData[] = [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST].map<ShortcutData | null>(direction => {
    //     const shortcut = racetrack.step(pos, direction);
    //     // console.log('query shortcut ...' + JSON.stringify(shortcut) + racetrack.at(shortcut));
    //     if (shortcut && (racetrack.at(shortcut) === Legend.WALL)) {
    //         const otherSide = racetrack.step(shortcut, direction);
    //         // console.log('query otherSide ...' + JSON.stringify(otherSide) + racetrack.at(otherSide));
    //         if (otherSide && racetrack.at(otherSide) !== Legend.WALL) {
    //             return { start: pos, end: otherSide };
    //         }
    //     }

    //     return null;
    // }).filter(s => s) as ShortcutData[];

    if (coordsToString(racetrack.find(Legend.END)!) === coordsToString(pos)) {
        return [];
    }

    const shortcuts = racetrack.reachable(pos, maxLength).filter(value => racetrack.at(value) !== Legend.WALL).map(shortcut => ({ start: pos, end: shortcut }));

    return shortcuts;
};

export const uniqueShortcuts = (value: Shortcut, index: number, array: Shortcut[]): boolean => {
    const res = array.findIndex(({ coords: { start, end } }) => start.i === value.coords.start.i && start.j === value.coords.start.j && end.i === value.coords.end.i && end.j === value.coords.end.j) === index;

    return res;
};

// eslint-disable-next-line max-lines-per-function
export const findShortcuts = (racetrack: StringArray2D, mazeOptions?: MazeOptions, maxLength: number = 2): Shortcut[] => {
    const { cost: { steps: target }, route } = solveAsMaze(racetrack, mazeOptions)!;

    const cache = new Map<string, number | null>();
    route.forEach((pos, d) => {
        const remainingDistance = target - d;
        cache.set(coordsToString(pos), remainingDistance);
    });
    cache.set(coordsToString(racetrack.find(Legend.END)!), 0);

    // eslint-disable-next-line max-lines-per-function
    return route.flatMap((step, idx) => {
        // If shortcut solution shorter than this remaining distance we have a viable shortcut
        const remainingDistance = target - idx;

        // eslint-disable-next-line max-statements, max-lines-per-function
        return getPossibleShortcuts(racetrack, step, maxLength).map(shortcut => {
            const key = coordsToString(shortcut.end);
            const SHORTCUT_LENGTH = distance(shortcut.start, shortcut.end);

            // Check if this value has been cached and return it if found
            if (cache.has(key)) {
                const cacheValue = cache.get(key);

                // CRUX ... 10 hours later :(
                if (typeof cacheValue === 'number' && !isNaN(cacheValue)) {
                    const saving = remainingDistance - cacheValue - SHORTCUT_LENGTH;
                    if (saving > 0) {
                        return { coords: shortcut, saving };
                    }
                }

                return null;
            }

            // console.log('cache miss ' + coordsToString(step) + ' ... getting new sol + route');
            // // racetrack.mark(shortcut.start, '.');
            // const solution = solveAsMaze(racetrack, {
            //     ...mazeOptions,
            //     start: shortcut.end
            // });
            // // racetrack.mark(shortcut.start, Legend.WALL);
            // console.log(JSON.stringify(solution));

            // // Did the shortcut result in a shorter time
            // if (solution) {
            //     const { cost: { steps: solutionSteps } } = solution;
            //     // Add new values to cache
            //     solution.route.forEach((pos, d) => {
            //         if (cache.has(coordsToString(pos)) === false) {
            //             const refinedRemainingDistance = solutionSteps - d;
            //             cache.set(coordsToString(pos), refinedRemainingDistance);

            //             console.log('storing into cache ' + coordsToString(step) + ' - ' + coordsToString(pos) + ' - ' + refinedRemainingDistance);
            //         }
            //     });

            //     const saving = remainingDistance - solutionSteps - SHORTCUT_LENGTH;
            //     // const saving = remainingDistance - cache.get(key) - SHORTCUT_LENGTH;
            //     console.log({ shortcut, remainingDistance, solutionSteps, saving, cached: cache.get(key) });

            //     if (saving > 0) {
            //         return { coords: shortcut, saving };
            //     }
            // }

            cache.set(key, null);

            return null;
        }).filter(s => s) as Shortcut[];
    });
};
