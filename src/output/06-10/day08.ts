import { findAntinodes, identify, loadFromFile } from '../../utils/06-10/antenna';

export const day08 = () => {
    console.log('--- Day 8: Resonant Collinearity ---');

    const grid = loadFromFile('./lib/06-10/antennas.txt');
    const antennas = identify(grid);

    // 344
    console.log(`Total antinodes location count: ${findAntinodes(grid, antennas).length}`);

    // 1182
    console.log(`Total antinodes (with projections) location count: ${findAntinodes(grid, antennas, true).length}`);
};
