import { aggregate, getTopologies, loadFromFile } from '../../utils/21-24/lan';
import { timings } from '../../utils/test/utils';

export const day23 = () => {
    console.log('--- Day 23: LAN Party ---');

    timings(() => {
        const connections = loadFromFile('./lib/21-24/connections.txt');
        const network = aggregate(connections);
        const topologies = getTopologies(network);

        // 1423
        console.log(`3-way connetions with the letter 't': ${topologies.filter(value => [0, 3, 6].map(d => value.charAt(d)).includes('t')).length}`);
    });
};
