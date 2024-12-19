import { determineSolveable, loadFromFile } from '../../utils/16-20/linen';
import { timings } from '../../utils/test/utils';

export const day19 = () => {
    console.log('--- Day 19: Linen Layout ---');

    const towels = loadFromFile('./lib/16-20/towels.txt');

    const solveableFromPart1 = timings(() => {
        // 290
        const solveable = determineSolveable(towels);
        console.log(`Possible design count is: ${solveable.length}`);

        return solveable;
    });

    timings(() => {
        // 712058625427487
        console.log(`Count of all possible solutions is: ${solveableFromPart1.reduce((acc, cur) => acc + cur.solutions, 0)}`);
    });
};
