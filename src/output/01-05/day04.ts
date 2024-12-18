import { timings } from '../../utils/test/utils';
import { loadFromFile, search } from '../../utils/01-05/word-search';
import { search as searchX } from '../../utils/01-05/x-mas';

export const day04 = () => {
    console.log('--- Day 4: Ceres Search ---');

    const grid = loadFromFile('./lib/01-05/word-search.txt');

    timings(() => {
        // 2554
        console.log(`XMAS appears in word search (occurence count): ${search(grid, 'XMAS')}`);
    });

    timings(() => {
        // 1916
        console.log(`X-MAS appears in word search (occurence count): ${searchX(grid, 'MAS')}`);
    });
};
