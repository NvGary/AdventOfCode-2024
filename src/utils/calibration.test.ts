import { getCorrect, loadFromFile } from './calibration';

const data = [
    { value: 190, ordinals: [10, 19] },
    { value: 3267, ordinals: [81, 40, 27] },
    { value: 83, ordinals: [17, 5] },
    { value: 156, ordinals: [15, 6] },
    { value: 7290, ordinals: [6, 8, 6, 15] },
    { value: 161011, ordinals: [16, 10, 13] },
    { value: 192, ordinals: [17, 8, 14] },
    { value: 21037, ordinals: [9, 7, 18, 13] },
    { value: 292, ordinals: [11, 6, 16, 20] },
];

describe('calibration util', () => {
    describe('function loadFromFile', () => {
        it('loads data correctly', () => {
            const res = loadFromFile('./lib/test/calibrations.txt');

            expect(res).toHaveLength(9);
            expect(res[0]).toHaveProperty('value', 190);
            expect(res[0].ordinals).toHaveLength(2);
            expect(res[0].ordinals).toEqual([10, 19]);

            expect(res[8]).toHaveProperty('value', 292);
            expect(res[8].ordinals).toHaveLength(4);
            expect(res[8].ordinals).toEqual([11, 6, 16, 20]);
        });
    });

    describe('function getCorrect', () => {
        it('identifies correct calibrations', () => {
            const res = getCorrect(data);

            expect(res).toHaveLength(3);

            const expectedValues = [0,1,8].map(i => data[i].value);
            expect(res.map(({value}) => value)).toEqual(expectedValues);

            expect(res.reduce<number>((acc, { value }) => acc + value, 0)).toBe(3749);
        });

        it('accepts optional operators', () => {
            const res = getCorrect(data, { concat: (a,b) => parseInt([a,b].join(''), 10) });

            expect(res).toHaveLength(6);

            const expectedValues = [0,1,3,4,6,8].map(i => data[i].value);
            expect(res.map(({value}) => value)).toEqual(expectedValues);

            expect(res.reduce<number>((acc, { value }) => acc + value, 0)).toBe(11387);
        });
    });
});
