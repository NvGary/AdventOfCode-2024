import { onlyUniqueCoords } from '../../utils/array2d';
import { loadFromFile, Maze } from '../../utils/16-20/maze';

export const day16 = () => {
    console.log('--- Day 16: Reindeer Maze ---');

    const maze = new Maze(loadFromFile('./lib/16-20/maze.txt'));
    const sols = maze.solve();

    // 135512
    console.log(`Lowest score a Reindeer could possibly get: ${Math.min(...sols.map(({ cost: { corners, steps } }) => corners * 1000 + steps))}`);

    // 541
    const paths = sols.flatMap(({ route, mergedRoutes }) => route.concat(mergedRoutes.flatMap(r => r)));
    console.log(`Best seat count is: ${paths.filter(onlyUniqueCoords).length}`);
};
