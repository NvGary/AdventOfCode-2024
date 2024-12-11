import { findAntinodes, identify, loadFromFile } from './antenna';
import { mapCoordsToString } from './test/utils';

describe('antenna utils', () => {
    let grid: ReturnType<typeof loadFromFile>;

    beforeEach(() => {
        grid = loadFromFile('./lib/test/antennas.txt');
    });

    describe('function loadFromFile', () => {
        it('loads data correctly', () => {
            const { grid: data } = grid;
            expect(data).toHaveLength(12);
            data.forEach(row => {
                expect(row).toHaveLength(12);
            });
            expect(data).toStrictEqual([
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
            ]);
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
            expect(mapCoordsToString(res[0].locations)).toEqual(['(1,8)', '(2,5)', '(3,7)', '(4,4)']);
            expect(mapCoordsToString(res[1].locations)).toEqual(['(5,6)', '(8,8)', '(9,9)']);
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
