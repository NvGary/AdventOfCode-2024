import { findTrails, getTrailHeads } from '../utils/hiking-trail';
import { Map } from '../utils/map';

export const day10 = () => {
    console.log('--- Day 10: Hoof It ---');

    const map = new Map<number>();
    map.loadFromFile('./lib/topology.txt', (string: string) => Number(string));
    const trailHeads = getTrailHeads(map);

    // 746
    console.log(`Sum of the scores of all unique trailheads: ${findTrails(map, trailHeads, true).length}`);

    // 1541
    console.log(`Sum of the scores of all trailheads: ${findTrails(map, trailHeads).length}`);
};
