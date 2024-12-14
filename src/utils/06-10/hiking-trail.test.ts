import { findTrails, getTrailHeads, loadFromFile } from './hiking-trail';
import { mapCoordsToString } from '../test/utils';

describe('hiking-trail util', () => {
    let map: ReturnType<typeof loadFromFile>;

    beforeEach(() => {
        map = loadFromFile('./lib/test/topology.txt');
    });

    describe('function loadFromFile', () => {
        it('loads data correctly', () => {
            const { grid: data } = map;
            expect(data).toHaveLength(8);
            data.forEach(row => {
                expect(row).toHaveLength(8);
            });
            expect(data).toStrictEqual([
                [8, 9, 0, 1, 0, 1, 2, 3],
                [7, 8, 1, 2, 1, 8, 7, 4],
                [8, 7, 4, 3, 0, 9, 6, 5],
                [9, 6, 5, 4, 9, 8, 7, 4],
                [4, 5, 6, 7, 8, 9, 0, 3],
                [3, 2, 0, 1, 9, 0, 1, 2],
                [0, 1, 3, 2, 9, 8, 0, 1],
                [1, 0, 4, 5, 6, 7, 3, 2],
            ]);
        });
    });

    describe('function getTrailHeads', () => {
        it('identifies trail heads', () => {
            const res = getTrailHeads(map);
            expect(res).toHaveLength(9);
            expect(mapCoordsToString(res)).toEqual([
                '(0,2)', '(0,4)', '(2,4)', '(4,6)', '(5,2)', '(5,5)', '(6,0)', '(6,6)', '(7,1)'
            ]);
        });
    });

    describe('function findTrails', () => {
        it('identifies unique trails', () => {
            const trailHeads = getTrailHeads(map);
            const res = findTrails(map, trailHeads, true);
            // console.log(JSON.stringify(res));
            expect(res).toHaveLength(36);
        });

        it('identifies trails', () => {
            const trailHeads = getTrailHeads(map);
            const res = findTrails(map, trailHeads);
            // console.log(JSON.stringify(res));
            expect(res).toHaveLength(81);
        });
    });
});
