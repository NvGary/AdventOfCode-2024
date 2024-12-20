import { Coords, Direction, onlyUniqueCoords, StringArray2D } from '../array2d';
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

const getPossibleShortcuts = (racetrack: StringArray2D, pos: Coords): ShortcutData[] => {
    // To be a shortcut we must traverse through 1 wall and come out the other side
    const shortcuts: ShortcutData[] = [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST].map<ShortcutData | null>(direction => {
        const shortcut = racetrack.step(pos, direction);
        // console.log('query shortcut ...' + JSON.stringify(shortcut) + racetrack.at(shortcut));
        if (shortcut && (racetrack.at(shortcut) === Legend.WALL)) {
            const otherSide = racetrack.step(shortcut, direction);
            // console.log('query otherSide ...' + JSON.stringify(otherSide) + racetrack.at(otherSide));
            if (otherSide && racetrack.at(otherSide) !== Legend.WALL) {
                return { start: shortcut, end: otherSide };
            }
        }

        return null;
    }).filter(s => s) as ShortcutData[];

    // console.log('possible shortcuts ... ' + shortcuts);
    return shortcuts;
};

export const uniqueShortcuts = (value: Shortcut, index: number, array: Shortcut[]): boolean => array.findIndex(({ coords: { start, end } }) => start.i === value.coords.start.i && start.j === value.coords.start.j && end.i === value.coords.end.i && end.j === value.coords.end.j) === index;

// eslint-disable-next-line max-lines-per-function
export const findShortcuts = (racetrack: StringArray2D, mazeOptions?: MazeOptions): Shortcut[] => {
    const { cost: { steps: target }, route } = solveAsMaze(racetrack, mazeOptions)!;

    const cache = new Map();
    route.forEach((pos, d) => {
        // const remainingDistance = d === 0 ? target - 1 : target - d;
        const remainingDistance = target - d;
        // console.log('adding to cache ' + JSON.stringify({ pos: coordsToString(pos), remainingDistance }));
        cache.set(coordsToString(pos), remainingDistance);
    });

    // eslint-disable-next-line max-lines-per-function
    return route.flatMap((step, idx) => {
        // If shortcut solution shorter than this remaining distance we have a viable shortcut
        const remainingDistance = target - idx;

        // eslint-disable-next-line max-statements, max-lines-per-function
        return getPossibleShortcuts(racetrack, step).map(shortcut => {
            const key = coordsToString(shortcut.end);
            const SHORTCUT_LENGTH = 2;

            // Check if this value has been cached and return it if found
            if (cache.has(key)) {
                const cacheValue = cache.get(key);

                if (cacheValue) {
                    const saving = remainingDistance - cacheValue - SHORTCUT_LENGTH;
                    // console.log('retrieved from cache');
                    // console.log({ coords: shortcut, remainingDistance, cacheValue, saving });
                    if (saving > 0) {
                        return { coords: shortcut, saving };
                    }
                }

                return null;
            }

            // console.log('cache miss ... getting new sol + route');
            racetrack.mark(shortcut.start, '.');
            const solution = solveAsMaze(racetrack, {
                ...mazeOptions,
                start: shortcut.end
            });
            racetrack.mark(shortcut.start, Legend.WALL);
            // console.log(JSON.stringify(solution));

            // Did the shortcut result in a shorter time
            if (solution) {
                const { cost: { steps: solutionSteps } } = solution;
                // Add new values to cache
                solution.route.forEach((pos, d) => {
                    if (cache.has(key) === false) {
                        const refinedRemainingDistance = solutionSteps - d;
                        cache.set(coordsToString(pos), refinedRemainingDistance);
                    }
                });

                const saving = remainingDistance - solutionSteps - SHORTCUT_LENGTH;
                // const saving = remainingDistance - solutionSteps ;
                // console.log({ remainingDistance, solutionSteps, saving });
                // remainingDistance - solutionSteps + 1

                if (saving > 0) {
                    return { coords: shortcut, saving };
                }
            }

            cache.set(key, null);

            return null;
        }).filter(s => s) as Shortcut[];
    }).filter(uniqueShortcuts);
};
