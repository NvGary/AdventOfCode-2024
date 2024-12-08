import { findAntinodes, identify, loadFromFile } from './antenna';

const grid = [
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '0', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '0', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '0', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '0', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', 'A', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', 'A', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', 'A', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
];

describe('antenna utils', () => {
    describe('function loadFromFile', () => {
        it('loads data correctly', () => {
            const data = loadFromFile('./lib/test/antennas.txt');
            expect(data).toHaveLength(12);
            data.forEach(row => {
                expect(row).toHaveLength(12);
            });
            expect(data).toStrictEqual(grid);
        });
    });

    describe('function identify', () => {
        it('correctly identifies frequencies', () => {
            const res = identify(grid).map(({ frequency }) => frequency);
            expect(res).toHaveLength(2);
            expect(res).toEqual(['0', 'A']);
        });

        it('correctly identifies frequency locations', () => {
            const res = identify(grid);
            expect(res[0].locations).toHaveLength(4);
            expect(res[1].locations).toHaveLength(3);
            expect(res[0].locations.map(({ i, j }) => `(${i},${j})`)).toEqual(['(1,8)', '(2,5)', '(3,7)', '(4,4)']);
            expect(res[1].locations.map(({ i, j }) => `(${i},${j})`)).toEqual(['(5,6)', '(8,8)', '(9,9)']);
        });
    });

    describe('function findAntinodes', () => {
        it('correctly finds antinodes', () => {
            const antennas = identify(grid);
            const res = findAntinodes(grid, antennas);

            expect(res).toHaveLength(14);
        });

        it('correctly finds antinodes (with projections)', () => {
            const antennas = identify(grid);
            const res = findAntinodes(grid, antennas, true);

            expect(res).toHaveLength(34);
        });
    });
});
