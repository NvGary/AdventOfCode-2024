import { findTrails, getTrailHeads, loadFromFile } from '../utils/hiking-trail';

export const day10 = () => {
    console.log('--- Day 10: Hoof It ---');

    const map = loadFromFile('./lib/topology.txt');
    const trailHeads = getTrailHeads(map);

    // 746
    console.log(`Sum of the scores of all unique trailheads: ${findTrails(map, trailHeads, true).length}`);

    // 1541
    console.log(`Sum of the scores of all trailheads: ${findTrails(map, trailHeads).length}`);
};
