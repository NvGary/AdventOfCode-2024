import { calcDifference, calcSimilarity } from "./locationId";

const left = [3,4,2,1,3,3];
const right = [4,3,5,3,9,3];

describe('locationId utils', () => {
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
