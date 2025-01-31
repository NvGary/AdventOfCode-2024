import { timings } from '../../utils/test/utils';
import { calculateMuls, loadFromFile } from '../../utils/01-05/mul';

export const day03 = () => {
    console.log('--- Day 3: Mull It Over ---');

    timings(() => {
        // 191183308
        console.log(`Multiplication results (commands disabled): ${calculateMuls(loadFromFile('./lib/01-05/muls.txt', false))}`);
    });

    timings(() => {
        // 92082041
        console.log(`Multiplication results (commands enabled): ${calculateMuls(loadFromFile('./lib/01-05/muls.txt'))}`);
    });
};
