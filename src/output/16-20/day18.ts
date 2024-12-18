import { corrupt, FREEMEM, loadFromFile } from '../../utils/16-20/memory';
import { timings } from '../../utils/test/utils';
import { onlyUniqueCoords, StringArray2D } from '../../utils/array2d';
import { Maze, MazeAlgorithm } from '../../utils/16-20/maze';

export const day18 = () => {
    console.log('--- Day 18: RAM Run ---');

    const bytes = loadFromFile('./lib/16-20/bytes.txt');

    timings(() => {
        const memory = new StringArray2D().fill({ i: 71, j: 71 }, FREEMEM);
        const corrupted = corrupt(memory, bytes, 1024);

        const maze = new Maze(corrupted);
        const [{ route }] = maze.solve({ start: { i: 0, j: 0 }, end: { i: 70, j: 70 }, useAlgorithm: MazeAlgorithm.MINIMUM_PATH }).sort(({ cost: { steps: a } }, { cost: { steps: b } }) => a - b);

        // route.forEach(path => corrupted.mark(path, 'O'));
        // console.log(corrupted.grid.map(r => r.join('')).join('\n'));

        // console.log(route.filter(onlyUniqueCoords).length);

        // 360
        console.log(`Shortest path is: ${route.filter(onlyUniqueCoords).length}`);
    });

    // timings(() => {

    //     // 164279024971453
    //     console.log(`Lowest positive initial value for register A: ${solutions.sort()[0]}`);
    // });
};
