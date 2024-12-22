import { complexity, loadFromFile } from '../../utils/21-24/keypad';
import { timings } from '../../utils/test/utils';

export const day21 = () => {
    console.log('--- Day 21: Keypad Conundrum ---');

    timings(() => {
        const codes = loadFromFile('./lib/21-24/codes.txt');
        const complexities = codes.map(complexity);

        // <<< 196304 <<< 205344
        console.log(`Total complexities are: ${complexities.reduce((acc, cur) => acc + cur)}`);
    });
};
