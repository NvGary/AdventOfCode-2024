import { timings } from '../../utils/test/utils';
import { findTrails, getTrailHeads, loadFromFile } from '../../utils/06-10/hiking-trail';

export const day10 = () => {
    console.log('--- Day 10: Hoof It ---');

    const map = loadFromFile('./lib/06-10/topology.txt');

    const trailHeadsFromPart1 = timings(() => {
        const trailHeads = getTrailHeads(map);

        // 746
        console.log(`Sum of the scores of all unique trailheads: ${findTrails(map, trailHeads, true).length}`);

        return trailHeads;
    });

    timings(() => {
        // 1541
        console.log(`Sum of the scores of all trailheads: ${findTrails(map, trailHeadsFromPart1).length}`);
    });
};
