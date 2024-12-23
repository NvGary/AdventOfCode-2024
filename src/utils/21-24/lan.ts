import { readFileByLine } from '../fs';

type Computer = string;

type Connection = {
    from: Computer;
    to: Computer;
};

type Network = Map<Computer, Computer[]>;

export const loadFromFile = (filename: string): Connection[] => readFileByLine(filename, line => {
    const [from, to] = line.split('-').sort();
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

/* eslint-disable no-invalid-this */
// eslint-disable-next-line func-style
function traverse(this: Network, parents: Computer[], id: Computer): string[] {
    const links: string[] = [id];

    const onward = this.get(id) ?? [];
    if (onward.length > 0) {
        onward.forEach(name => {
            const parentLinked = parents.every(key => this.get(key)!.includes(name));
            if (parentLinked) {
                links.push(...traverse.call(this, parents.concat(id), name).map(r => `${id},${r}`));
            }
        });
    }

    return links;
}
/* eslint-enable no-invalid-this */

export const maxTopologies = (network: Network): string[] => {
    const links: string[] = [];

    const link = network[Symbol.iterator]();

    for (const [key, value] of link) {
        value.forEach(id => {
            links.push(...traverse.call(network, [key], id).map(r => `${key},${r}`));
        });
    }

    return links;
};
