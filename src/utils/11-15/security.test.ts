import { loadFromFile, patrol, safetyFactor } from './security';
import { Array2D } from '../array2d';

describe('security utils', () => {
    let robots: ReturnType<typeof loadFromFile>;

    beforeEach(() => {
        robots = loadFromFile('./lib/test/robots.txt');
    });

    describe('function loadFromFile', () => {
        it('loads robot data', () => {
            expect(robots).toHaveLength(12);
            expect(robots[0]).toEqual({ position: { j: 0, i: 4 }, velocity: { j: 3, i: -3 } });
            expect(robots.pop()).toEqual({ position: { j: 9, i: 5 }, velocity: { j: -3, i: -3 } });
        });
    });

    describe('function patrol', () => {
        it('calculates robot movement', () => {
            const grid = new Array2D<number>(() => 0).fill({ i: 7, j: 11 }, 0);

            // P=2,4 v=2,-3
            expect(patrol(grid, robots.slice(10, 11), 1)[0].position).toEqual({
                i: 1, j: 4
            });
            expect(patrol(grid, robots.slice(10, 11), 2)[0].position).toEqual({
                i: 5, j: 6
            });
            expect(patrol(grid, robots.slice(10, 11), 3)[0].position).toEqual({
                i: 2, j: 8
            });
            expect(patrol(grid, robots.slice(10, 11), 4)[0].position).toEqual({
                i: 6, j: 10
            });
            expect(patrol(grid, robots.slice(10, 11), 5)[0].position).toEqual({
                i: 3, j: 1
            });
        });

        it('calulates all robot movements', () => {
            const grid = new Array2D<number>(() => 0).fill({ i: 7, j: 11 }, 0);
            const prediction = patrol(grid, robots, 100);

            const positions = prediction.reduce((cur, acc) => {
                cur.mark(acc.position, cur.at(acc.position)! + 1);
                return cur;
            }, grid);

            expect(positions.grid).toEqual([
                [0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            ]);
        });
    });

    describe('function safetyFactor', () => {
        it('totals quadrant correctly', () => {
            const grid = new Array2D<number>(() => 0).fill({ i: 7, j: 11 }, 0);
            const prediction = patrol(grid, robots, 100);

            const res = safetyFactor(grid, prediction);
            expect(res).toBe(12);
        });
    });
});
