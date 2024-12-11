import { advanceTime, loadFromFile, sum } from './spacetime';

const data = [125, 17];

describe('locationId utils', () => {
    describe('function loadFromFile', () => {
        it('loads data correctly', () => {
            const pebbles = loadFromFile('./lib/test/pebbles.txt');
            expect(pebbles).toHaveLength(2);
            expect(pebbles).toEqual([125, 17]);
        });
    });

    describe('function advanceTime', () => {
        it('correctly advances time by 1', () => {
            const pebbleCount = advanceTime(data, 1);
            expect(Object.keys(pebbleCount)).toHaveLength(3);
            expect(sum(pebbleCount)).toBe(3);
        });

        it('correctly advances time by 6', () => {
            const res = advanceTime(data, 6);
            expect(sum(res)).toBe(22);
        });

        it('correctly advances time by 25', () => {
            const res = advanceTime(data, 25);
            expect(sum(res)).toBe(55312);
        });
    });
});
