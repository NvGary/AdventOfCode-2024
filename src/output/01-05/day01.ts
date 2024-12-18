import { timings } from '../../utils/test/utils';
import { calcDifference, calcSimilarity, loadFromFile } from '../../utils/01-05/location-id';

export const day01 = () => {
    console.log('--- Day 1: Historian Hysteria ---');

    const [left, right] = loadFromFile('./lib/01-05/location-ids.txt');

    timings(() => {
        // 1320851
        console.log(`Location Id difference is: ${calcDifference(left.sort(), right.sort())}`);
    });

    timings(() => {
        // 26859182
        console.log(`Location Id similarity is: ${calcSimilarity(left, right)}`);
    });
};
