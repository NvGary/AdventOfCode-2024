import { aggregate, getTopologies, loadFromFile, maxTopologies } from '../../utils/21-25/lan';
import { timings } from '../../utils/test/utils';

export const day23 = () => {
    console.log('--- Day 23: LAN Party ---');

    timings(() => {
        const connections = loadFromFile('./lib/21-25/connections.txt');
        const network = aggregate(connections);
        const topologies = getTopologies(network);

        // 1423
        console.log(`3-way connetions with the letter 't': ${topologies.filter(value => [0, 3, 6].map(d => value.charAt(d)).includes('t')).length}`);
    });

    timings(() => {
        const connections = loadFromFile('./lib/21-25/connections.txt');
        const network = aggregate(connections);

        const topologies = maxTopologies(network).sort((a, b) => b.length - a.length);

        // eslint-disable-next-line capitalized-comments
        // gt,ha,ir,jn,jq,kb,lr,lt,nl,oj,pp,qh,vy
        console.log(`Password to get into the LAN party is: ${topologies[0]}`);
    });
};
