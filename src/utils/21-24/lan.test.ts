import { aggregate, getTopologies, loadFromFile } from './lan';

describe('lan utils', () => {
    describe('function loadFromFile', () => {
        it('loads connections from file', () => {
            const connections = loadFromFile('./lib/21-24/test/connections.txt');

            expect(connections).toHaveLength(32);
            expect(connections[0]).toEqual({ from: 'kh', to: 'tc' });
            expect(connections.pop()).toEqual({ from: 'td', to: 'yn' });
        });
    });

    describe('function aggregate', () => {
        it('aggregates connections into a map', () => {
            const connections = loadFromFile('./lib/21-24/test/connections.txt');
            const network = aggregate(connections);

            expect(network.get('aq')).toHaveLength(4);
            expect(network.get('wh')).toHaveLength(1);
        });
    });

    describe('function getTopologies', () => {
        it('identifies 3-length topologies', () => {
            const connections = loadFromFile('./lib/21-24/test/connections.txt');
            const network = aggregate(connections);
            const topologies = getTopologies(network);

            expect(topologies).toHaveLength(12);
            expect(topologies.includes('aq,cg,yn')).toBe(true);
            expect(topologies.includes('ub,vc,wq')).toBe(true);
        });

        it('contains 7 topologies with the letter "t"', () => {
            const connections = loadFromFile('./lib/21-24/test/connections.txt');
            const network = aggregate(connections);
            const topologies = getTopologies(network);

            expect(topologies.filter(value => [0, 3, 6].map(d => value.charAt(d)).includes('t'))).toHaveLength(7);
        });
    });
});
