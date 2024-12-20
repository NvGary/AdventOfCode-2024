import { findShortcuts,loadFromFile } from '../../utils/16-20/race';
import { timings } from '../../utils/test/utils';

export const day20 = () => {
    console.log('--- Day 20: Race Condition ---');

    const racetrack = loadFromFile('./lib/16-20/racetrack.txt');

    timings(() => {
        // 1323
        const shortcuts = findShortcuts(racetrack);
        const filtered = shortcuts.filter(({ saving }) => saving >= 100);
        console.log(`Shortcuts saving at least 100 picoseconds are: ${filtered.length}`);
    });

    // timings(() => {
    //     // 712058625427487
    //     console.log(`Count of all possible solutions is: ${solveableFromPart1.reduce((acc, cur) => acc + cur.solutions, 0)}`);
    // });
};
