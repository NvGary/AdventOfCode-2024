import { findShortcuts, loadFromFile } from '../../utils/16-20/race';
import { timings } from '../../utils/test/utils';

export const day20 = () => {
    console.log('--- Day 20: Race Condition ---');

    timings(() => {
        const racetrack = loadFromFile('./lib/16-20/racetrack.txt');
        const shortcuts = findShortcuts(racetrack);
        const filtered = shortcuts.filter(({ saving }) => saving >= 100);

        // 1323
        console.log(`Shortcuts saving at least 100 picoseconds are: ${filtered.length}`);
    });

    timings(() => {
        const racetrack = loadFromFile('./lib/16-20/racetrack.txt');
        const shortcuts = findShortcuts(racetrack, {}, 20);
        const filtered = shortcuts.filter(({ saving }) => saving >= 100);

        // 983642 --- low   983905 --- correct
        console.log(`Longer shortcuts (max length 20) saving at least 100 picoseconds are: ${filtered.length}`);
    });
};
