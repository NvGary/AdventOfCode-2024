import { calcPerimeter, countEdges, findPlots, loadFromFile } from './garden';

describe('garden utils', () => {
    let garden: ReturnType<typeof loadFromFile>;

    beforeEach(() => {
        garden = loadFromFile('./lib/11-15/test/garden.txt');
    });

    describe('function loadFromFile', () => {
        it('loads content properly', () => {
            const { i, j } = garden.getSize();

            expect(i).toBe(10);
            expect(j).toBe(10);
        });
    });

    describe('function findPlots', () => {
        it('finds all plots', () => {
            const plots = findPlots(garden);

            expect(plots).toHaveLength(11);
            expect(plots[0].coords).toHaveLength(12);
            expect(plots[1].coords).toHaveLength(4);
            expect(plots.pop()!.coords).toHaveLength(3);
        });
    });

    describe('function calcPerimeter', () => {
        it('correctly calculates perimeter', () => {
            const plots = findPlots(garden);

            expect(calcPerimeter(plots[0], garden)).toBe(18);
            expect(calcPerimeter(plots[1], garden)).toBe(8);
            expect(calcPerimeter(plots.pop()!, garden)).toBe(8);
        });

        it('yields correct pricing', () => {
            const plots = findPlots(garden);
            const price = plots.reduce((acc, cur) => acc + cur.coords.length * calcPerimeter(cur, garden), 0);

            expect(price).toBe(1930);
        });
    });

    describe('function countEdges', () => {
        it('correctly counts edges', () => {
            const plots = findPlots(garden);

            expect(countEdges(plots[0], garden)).toBe(10);
            expect(countEdges(plots[1], garden)).toBe(4);
            expect(countEdges(plots.pop()!, garden)).toBe(6);
        });

        it('yields correct pricing', () => {
            const plots = findPlots(garden);
            const price = plots.reduce((acc, cur) => acc + cur.coords.length * countEdges(cur, garden), 0);

            expect(price).toBe(1206);
        });
    });
});
