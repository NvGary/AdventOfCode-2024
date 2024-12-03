import { calculateMuls, loadFromFile } from './mul';

const muls = [
    { digits: [2,4] },
    { digits: [5,5] },
    { digits: [11,8] },
    { digits: [8,5] }
];

describe('mul utils', () => {
    describe('function loadFromFile', () => {
        describe('commands disabled', () => {
            it('loads data correctly', () => {
                const data = loadFromFile('./lib/test/muls.txt', false);
                expect(data).toHaveLength(4);
                expect(data).toStrictEqual(muls);
            });
        });

        describe('commands enabled', () => {
            it('loads data correctly', () => {
                const data = loadFromFile('./lib/test/muls.txt');
                expect(data).toHaveLength(2);
                expect(data).toStrictEqual([muls[0], muls[3]]);
            });
        });
    });

    describe('function calculateMuls', () => {
        describe('commands disabled', () => {
            it('calculate correctly', ()=> {
                const res = calculateMuls(muls);
                expect(res).toBe(161);
            });
            });

        describe('commands enabled', () => {
            it('calculate correctly', ()=> {
                const res = calculateMuls([muls[0], muls[3]]);
                expect(res).toBe(48);
            });
        });
    });
});
