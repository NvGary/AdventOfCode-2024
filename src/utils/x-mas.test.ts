import { loadFromFile } from './word-search';
import { search } from './x-mas';

describe('report utils', () => {
    let grid: ReturnType<typeof loadFromFile>;

    beforeEach(() => {
        grid = loadFromFile('./lib/test/word-search.txt');
    });

    describe('function search', () => {
        it('correctly counts X-MAS', () => {
            const res = search(grid, 'MAS');
            expect(res).toBe(9);
        });
    });
});
