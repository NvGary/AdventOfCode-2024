import { readFileByLine } from '../fs';

type Computer = string;

type Connection = {
    from: Computer;
    to: Computer;
};

type Network = Map<Computer, Computer[]>;

export const loadFromFile = (filename: string): Connection[] => readFileByLine(filename, line => {
    const [from, to] = line.split('-').sort();
    if (from.length !== 2 || to.length !== 2) {
        console.log('IRREGULAR LENGTH ' + from + '-' + to);
    }
    return { from, to };
});

export const aggregate = (connections: Connection[]): Network => connections.reduce(
    (acc, { from, to }) => {
        const topology = acc.get(from) ?? [];
        if (topology.includes(to) === false) {
            topology.push(to);
        }
        acc.set(from, topology);

        return acc;
    }, new Map<Computer, Computer[]>()
);

export const getTopologies = (network: Network): string[] => {
    const links: string[] = [];
    const link = network[Symbol.iterator]();

    for (const [key, value] of link) {
        value.forEach(id => {
            const onward = network.get(id) ?? [];
            if (onward.length > 0) {
                onward.forEach(name => {
                    if (value.includes(name)) {
                        links.push([key, id, name].join(','));
                    }
                });
            }
        });
    }

    return links;
};
