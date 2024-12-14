import { calculateProductionTotals, correctOrdering, hasCorrectOrdering, hasIncorrectOrdering, loadFromFile } from './print-queue';

describe('print-queue utils', () => {
    describe('function loadFromFile', () => {
        it('loads ordering data correctly', () => {
            const { ordering } = loadFromFile('./lib/test/print-queue.txt');

            expect(ordering).toBeDefined();
            expect(ordering).toHaveLength(21);
            expect(ordering.shift()).toEqual([47, 53]);
            expect(ordering.pop()).toEqual([53, 13]);
        });

        it('loads production data correctly', () => {
            const { production } = loadFromFile('./lib/test/print-queue.txt');

            expect(production).toBeDefined();
            expect(production).toHaveLength(6);
            expect(production.shift()).toEqual([75, 47, 61, 53, 29]);
            expect(production.pop()).toEqual([97, 13, 75, 29, 47]);
        });
    });

    describe('function hasCorrectOrdering', () => {
        it('identifies production with correct ordering', () => {
            const data = loadFromFile('./lib/test/print-queue.txt');
            const production = hasCorrectOrdering(data);

            expect(production).toHaveLength(3);
            expect(production).toEqual([
                [75, 47, 61, 53, 29],
                [97, 61, 53, 29, 13],
                [75, 29, 13]
            ]);
        });
    });

    describe('function hasIncorrectOrdering', () => {
        it('identifies production with correct ordering', () => {
            const data = loadFromFile('./lib/test/print-queue.txt');
            const production = hasIncorrectOrdering(data);

            expect(production).toHaveLength(3);
            expect(production).toEqual([
                [75, 97, 47, 61, 53],
                [61, 13, 29],
                [97, 13, 75, 29, 47],
            ]);
        });
    });

    describe('function calculateProductionTotals', () => {
        it('calculates correct total', () => {
            const production = [
                [75, 47, 61, 53, 29],
                [97, 61, 53, 29, 13],
                [75, 29, 13]
            ];

            expect(calculateProductionTotals(production)).toBe(143);
        });
    });

    describe('function correctOrdering', () => {
        it('identifies production with correct ordering', () => {
            const { ordering } = loadFromFile('./lib/test/print-queue.txt');
            const production = correctOrdering({ ordering,
                production: [
                    [75, 97, 47, 61, 53],
                    [61, 13, 29],
                    [97, 13, 75, 29, 47],
                ] });

            expect(production).toHaveLength(3);
            expect(production).toEqual([
                [97, 75, 47, 61, 53],
                [61, 29, 13],
                [97, 75, 47, 29, 13],
            ]);
        });
    });
});
