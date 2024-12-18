import { corrupt, determineMaxCorruption, FREEMEM, loadFromFile, solveAsMaze } from '../../utils/16-20/memory';
import { timings } from '../../utils/test/utils';
import { onlyUniqueCoords, StringArray2D } from '../../utils/array2d';

export const day18 = () => {
    console.log('--- Day 18: RAM Run ---');

    const bytes = loadFromFile('./lib/16-20/bytes.txt');

    timings(() => {
        const memory = new StringArray2D().fill({ i: 71, j: 71 }, FREEMEM);
        const corrupted = corrupt(memory, bytes, 1024);

        const { route } = solveAsMaze(corrupted, { start: { i: 0, j: 0 }, end: { i: 70, j: 70 } })!;

        // 360
        console.log(`Shortest path is: ${route.filter(onlyUniqueCoords).length}`);
    });

    timings(() => {
        const memory = new StringArray2D().fill({ i: 71, j: 71 }, FREEMEM);
        const corrupted = corrupt(memory, bytes, 1024);
        const { i, j } = determineMaxCorruption(corrupted, bytes.slice(1024), { start: { i: 0, j: 0 }, end: { i: 70, j: 70 } })!;

        // 58,62
        console.log(`Byte which blocks exit from being reachable is: (${[j, i].join(',')})`);
    });
};
