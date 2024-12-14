import { calculateMuls, loadFromFile } from '../../utils/01-05/mul';

export const day03 = () => {
    console.log('--- Day 3: Mull It Over ---');

    // 191183308
    console.log(`Multiplication results (commands disabled): ${calculateMuls(loadFromFile('./lib/muls.txt', false))}`);
    // 92082041
    console.log(`Multiplication results (commands enabled): ${calculateMuls(loadFromFile('./lib/muls.txt'))}`);
};
