import { loadFromFile, patrol, safetyFactor } from '../../utils/11-15/security';
import { Array2D } from '../../utils/array2d';

// eslint-disable-next-line max-statements
export const day14 = () => {
    console.log('--- Day 14: Restroom Redoubt ---');

    const robots = loadFromFile('./lib/11-15/robots.txt');
    const grid = new Array2D<number>(() => 0).fill({ i: 103, j: 101 }, 0);
    const prediction = patrol(grid, robots, 100);

    // 231852216
    console.log(`Safety factor is: ${safetyFactor(grid, prediction)}`);

    // Started with 0, increasing by 1000 when solution was not found
    let i = 8000;
    let foundEasterEgg = false;
    let positions: Array2D<string> = new Array2D<string>(() => '.');

    while (i < 10000 && !foundEasterEgg) {
        const allocated = patrol(grid, robots, i);
        positions = allocated.reduce((acc, cur) => {
            acc.mark(cur.position, 'X');
            return acc;
        }, new Array2D<string>(() => '.').fill({ i: 103, j: 101 }, '.'));

        // Started with Array(5)
        // Array(8) finally yields xmas tree 'picture'
        foundEasterEgg = positions.contains(Array(8).fill('X'));
        ++i;
    }

    // 8159
    if (foundEasterEgg) {
        console.log(positions!.grid.map(row => row.join('')).join('\n'));
        console.log(`Found easter egg after ${i - 1} seconds lapsed`);
    }
    else {
        console.log(`Unable to find easter egg after ${i} seconds lapsed`);
    }
};
