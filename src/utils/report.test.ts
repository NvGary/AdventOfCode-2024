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
        it.each`
            data | result
            ${reports[0]} | ${true}
            ${reports[1]} | ${false}
            ${reports[2]} | ${false}
            ${reports[3]} | ${false}
            ${reports[4]} | ${false}
            ${reports[5]} | ${true}
        `('correctly determines safety status', ({ data, result }) => {
            expect(isSafe(data)).toBe(result);
        });
    });

    describe('function isSafeWithDampener', () => {
        it.each`
            data | result
            ${reports[0]} | ${true}
            ${reports[1]} | ${false}
            ${reports[2]} | ${false}
            ${reports[3]} | ${true}
            ${reports[4]} | ${true}
            ${reports[5]} | ${true}
            ${{ levels: [1,1,2,3,4,5] }} | ${true}
            ${{ levels: [1,2,3,3,4,5] }} | ${true}
            ${{ levels: [1,2,3,4,5,5] }} | ${true}
            ${{ levels: [10,1,2,3,4,5] }} | ${true}
            ${{ levels: [1,2,3,10,4,5] }} | ${true}
            ${{ levels: [1,2,3,4,5,10] }} | ${true}
            ${{ levels: [2,1,2,3,4,5] }} | ${true}
            ${{ levels: [1,2,3,2,4,5] }} | ${true}
            ${{ levels: [1,2,3,4,5,4] }} | ${true}
        `('correctly determines safety status', ({ data, result }) => {
            expect(isSafeWithDampener(data)).toBe(result);
        });
    });
});
