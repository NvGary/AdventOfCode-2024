import { timings } from '../../utils/test/utils';
import { findAntinodes, identify, loadFromFile } from '../../utils/06-10/antenna';

export const day08 = () => {
    console.log('--- Day 8: Resonant Collinearity ---');

    const grid = loadFromFile('./lib/06-10/antennas.txt');

    const antennasFromPart1 = timings(() => {
        const antennas = identify(grid);
        // 344
        console.log(`Total antinodes location count: ${findAntinodes(grid, antennas).length}`);

        return antennas;
    });

    timings(() => {
        // 1182
        console.log(`Total antinodes (with projections) location count: ${findAntinodes(grid, antennasFromPart1, true).length}`);
    });
};
