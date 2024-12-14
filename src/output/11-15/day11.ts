import { advanceTime, loadFromFile, sum } from '../../utils/11-15/spacetime';

export const day11 = () => {
    console.log('--- Day 11: Plutonian Pebbles ---');

    const pebbles = loadFromFile('./lib/pebbles.txt');

    // 172484
    console.log(`Count of stones after 25 iterations: ${sum(advanceTime(pebbles, 25))}`);

    // 205913561055242
    console.log(`Count of stones after 75 iterations: ${sum(advanceTime(pebbles, 75))}`);
};
