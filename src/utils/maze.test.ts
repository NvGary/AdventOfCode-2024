import { advanceTime, countVisited, createDejavu, loadFromFile } from './maze';

describe('map utils', () => {
    let grid: ReturnType<typeof loadFromFile>;

    beforeEach(() => {
        grid = loadFromFile('./lib/test/map.txt');
    });

    describe('function loadFromFile', () => {
        it('loads data correctly', () => {
            const { grid: data } = grid;
            expect(data).toHaveLength(10);
            data.forEach(row => {
                expect(row).toHaveLength(10);
            });
            expect(data).toStrictEqual([
                ['.', '.', '.', '.', '#', '.', '.', '.', '.', '.'],
                ['.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
                ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
                ['.', '.', '#', '.', '.', '.', '.', '.', '.', '.'],
                ['.', '.', '.', '.', '.', '.', '.', '#', '.', '.'],
                ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
                ['.', '#', '.', '.', '^', '.', '.', '.', '.', '.'],
                ['.', '.', '.', '.', '.', '.', '.', '.', '#', '.'],
                ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
                ['.', '.', '.', '.', '.', '.', '#', '.', '.', '.'],
            ]);
        });
    });

    describe('function advanceTime', () => {
        it('moves the guard predictably', () => {
            const { map: res } = advanceTime(grid);
            expect(countVisited(res)).toBe(41);
        });
    });

    describe('function createDejavu', () => {
        it('correctly predicts dejavu', () => {
            const { map: res } = advanceTime(grid);
            expect(createDejavu(res)).toBe(6);
        });
    });
});
