import { type Coords, Map } from './map';
import { findTrails, getTrailHeads } from './hiking-trail';

const mapCoordsToString = (coords: Coords[]): string[] => coords.map(({ i, j }) => `(${i},${j})`);

describe('hiking-trail util', () => {
    describe('function getTrailHeads', () => {
        it('identifies trail heads', () => {
            const map = new Map<number>();
            map.loadFromFile('./lib/test/topology.txt', (string: string) => Number(string));

            const res = getTrailHeads(map);
            expect(res).toHaveLength(9);
            expect(mapCoordsToString(res)).toEqual([
                '(0,2)', '(0,4)', '(2,4)', '(4,6)', '(5,2)', '(5,5)', '(6,0)', '(6,6)', '(7,1)'
            ]);
        });
    });

    describe('function findTrails', () => {
        it('identifies unique trails', () => {
            const map = new Map<number>();
            map.loadFromFile('./lib/test/topology.txt', (string: string) => Number(string));

            const trailHeads = getTrailHeads(map);
            const res = findTrails(map, trailHeads, true);
            // console.log(JSON.stringify(res));
            expect(res).toHaveLength(36);
        });

        it('identifies trails', () => {
            const map = new Map<number>();
            map.loadFromFile('./lib/test/topology.txt', (string: string) => Number(string));

            const trailHeads = getTrailHeads(map);
            const res = findTrails(map, trailHeads);
            // console.log(JSON.stringify(res));
            expect(res).toHaveLength(81);
        });
    });
});
