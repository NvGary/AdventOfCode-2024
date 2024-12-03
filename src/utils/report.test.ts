import { isSafe, isSafeWithDampener, loadFromFile } from "./report";

const reports = [
    { levels: [7,6,4,2,1] },
    { levels: [1,2,7,8,9] },
    { levels: [9,7,6,2,1] },
    { levels: [1,3,2,4,5] },
    { levels: [8,6,4,4,1] },
    { levels: [1,3,6,7,9] }
];

describe('report utils', () => {
    describe('function loadFromFile', () => {
        it('loads data correctly', () => {
            const data = loadFromFile('./lib/test/reports.txt');
            expect(data).toHaveLength(6);
            expect(data).toStrictEqual(reports);
        });
    });

    describe('function isSafe', () => {
        it('correctly determines safety status', () => {
            expect(isSafe(reports[0])).toBe(true);
            expect(isSafe(reports[1])).toBe(false);
            expect(isSafe(reports[2])).toBe(false);
            expect(isSafe(reports[3])).toBe(false);
            expect(isSafe(reports[4])).toBe(false);
            expect(isSafe(reports[5])).toBe(true);
        });
    });

    describe('function isSafeWithDampener', () => {
        it('correctly determines safety status', () => {
            expect(isSafeWithDampener(reports[0])).toBe(true);
            expect(isSafeWithDampener(reports[1])).toBe(false);
            expect(isSafeWithDampener(reports[2])).toBe(false);
            expect(isSafeWithDampener(reports[3])).toBe(true);
            expect(isSafeWithDampener(reports[4])).toBe(true);
            expect(isSafeWithDampener(reports[5])).toBe(true);

            expect(isSafeWithDampener({ levels: [1,1,2,3,4,5] })).toBe(true);
            expect(isSafeWithDampener({ levels: [1,2,3,3,4,5] })).toBe(true);
            expect(isSafeWithDampener({ levels: [1,2,3,4,5,5] })).toBe(true);

            expect(isSafeWithDampener({ levels: [10,1,2,3,4,5] })).toBe(true);
            expect(isSafeWithDampener({ levels: [1,2,3,10,4,5] })).toBe(true);
            expect(isSafeWithDampener({ levels: [1,2,3,4,5,10] })).toBe(true);

            expect(isSafeWithDampener({ levels: [2,1,2,3,4,5] })).toBe(true);
            expect(isSafeWithDampener({ levels: [1,2,3,2,4,5] })).toBe(true);
            expect(isSafeWithDampener({ levels: [1,2,3,4,5,4] })).toBe(true);
        });
    });
});
