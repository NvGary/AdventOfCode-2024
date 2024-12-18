import { timings } from '../../utils/test/utils';
import { onlyUniqueCoords } from '../../utils/array2d';
import { loadFromFile, Maze } from '../../utils/16-20/maze';

export const day16 = () => {
    console.log('--- Day 16: Reindeer Maze ---');

    const maze = new Maze(loadFromFile('./lib/16-20/maze.txt'));

    const solutionsFromPart1 = timings(() => {
        const solutions = maze.solve();

        // 135512
        console.log(`Lowest score a Reindeer could possibly get: ${Math.min(...solutions.map(({ cost: { corners, steps } }) => corners * 1000 + steps))}`);

        return solutions;
    });

    timings(() => {
        // 541
        const paths = solutionsFromPart1.flatMap(({ route, mergedRoutes }) => route.concat(mergedRoutes.flatMap(r => r)));
        console.log(`Best seat count is: ${paths.filter(onlyUniqueCoords).length}`);
    });
};
