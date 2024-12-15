import { calcPerimeter, countEdges, findPlots, loadFromFile } from '../../utils/11-15/garden';

export const day12 = () => {
    console.log('--- Day 12: Garden Groups ---');

    const garden = loadFromFile('./lib/11-15/garden.txt');

    const plots = findPlots(garden);

    // 1477924
    console.log(`Total price of fencing all regions by perimeter: ${plots.reduce((acc, cur) => acc + cur.coords.length * calcPerimeter(cur, garden), 0)}`);

    // 841934
    console.log(`Total price of fencing all regions by edges: ${plots.reduce((acc, cur) => acc + cur.coords.length * countEdges(cur, garden), 0)}`);
};
