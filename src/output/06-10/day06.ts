import { advanceTime, countVisited, createDejavu, loadFromFile } from '../../utils/06-10/maze';

export const day06 = () => {
    console.log('--- Day 6: Guard Gallivant ---');

    const data = loadFromFile('./lib/06-10/map.txt');
    const { map: res } = advanceTime(data);

    // 5531
    console.log(`Unique positions visited: ${countVisited(res)}`);
    // 2165
    console.log(`Minimize time paradoxes with ${createDejavu(res)} unique obstacles`);
};
