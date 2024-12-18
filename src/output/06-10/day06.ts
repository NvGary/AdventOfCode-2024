import { timings } from '../../utils/test/utils';
import { advanceTime, countVisited, createDejavu, loadFromFile } from '../../utils/06-10/maze';

export const day06 = () => {
    console.log('--- Day 6: Guard Gallivant ---');

    const data = loadFromFile('./lib/06-10/map.txt');

    const { map: mapFromPart1 } = timings(() => {
        const { map } = advanceTime(data);

        // 5531
        console.log(`Unique positions visited: ${countVisited(map)}`);

        return { map };
    });

    timings(() => {
        // 2165
        console.log(`Minimize time paradoxes with ${createDejavu(mapFromPart1)} unique obstacles`);
    });
};
