import { advanceTime, countVisited, createDejavu, loadFromFile } from './map';

const grid = [
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
];

describe('report utils', () => {
    describe('function loadFromFile', () => {
        it('loads data correctly', () => {
            const data = loadFromFile('./lib/test/map.txt');
            expect(data).toHaveLength(10);
            data.forEach(row => {
                expect(row).toHaveLength(10);
            });
            expect(data).toStrictEqual(grid);
        });
    });

    describe('function advanceTime', () => {
        it('moves the guard predictably', () => {
            const data = loadFromFile('./lib/test/map.txt');
            const { map: res } = advanceTime(data);
            expect(countVisited(res)).toBe(41);
        });
    });

    describe('function createDejavu', () => {
        it('correctly predicts dejavu', () => {
            const data = loadFromFile('./lib/test/map.txt');
            const { map: res } = advanceTime(data);
            expect(createDejavu(res)).toBe(6);
        });
    });
});
