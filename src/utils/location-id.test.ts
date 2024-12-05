import { calcDifference, calcSimilarity, loadFromFile } from './location-id';

const left = [3,4,2,1,3,3],
 right = [4,3,5,3,9,3];

describe('locationId utils', () => {
    describe('function loadFromFile', () => {
        it('loads data correctly', () => {
            const data = loadFromFile('./lib/test/location-ids.txt');
            expect(data).toHaveLength(2);
            expect(data[0]).toStrictEqual(left);
            expect(data[1]).toStrictEqual(right);
        });
    });
    
    describe('function calcDifference', () => {
        it('calculates total distance of 11', () => {
            const res = calcDifference(left.sort(), right.sort());
            expect(res).toBe(11);
        });
    });
    
    describe('function calcSimilarity', () => {
        it('calculates similarity score of 31', () => {
            const res = calcSimilarity(left, right);
            expect(res).toBe(31);
        });
    });
});
