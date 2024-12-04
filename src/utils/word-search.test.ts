import { loadFromFile, search } from './word-search';

const grid = [
    ['M','M','M','S','X','X','M','A','S','M'],
    ['M','S','A','M','X','M','S','M','S','A'],
    ['A','M','X','S','X','M','A','A','M','M'],
    ['M','S','A','M','A','S','M','S','M','X'],
    ['X','M','A','S','A','M','X','A','M','M'],
    ['X','X','A','M','M','X','X','A','M','A'],
    ['S','M','S','M','S','A','S','X','S','S'],
    ['S','A','X','A','M','A','S','A','A','A'],
    ['M','A','M','M','M','X','M','M','M','M'],
    ['M','X','M','X','A','X','M','A','S','X'],
];

describe('report utils', () => {
    describe('function loadFromFile', () => {
        it('loads data correctly', () => {
            const data = loadFromFile('./lib/test/word-search.txt');
            expect(data).toHaveLength(10);
            data.forEach(row => {
                expect(row).toHaveLength(10);
            });
            expect(data).toStrictEqual(grid);
        });
    });

    describe('function search', () => {
        it('correctly counts XMAS', () => {
            const res = search(grid, 'XMAS');
            expect(res).toBe(18);
        })
    });
});
