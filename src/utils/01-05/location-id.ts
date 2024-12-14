import { readFileByLine } from '../fs';

export type LocationId = number;

const parseLocationId = (string: string) => parseInt(string, 10);

export const loadFromFile = (filename: string): LocationId[][] => {
    const data: Array<Array<LocationId>> = readFileByLine(filename, line => {
        const [l, r] = line.split('   ');
        return [parseLocationId(l), parseLocationId(r)];
    });

    return data.reduce((acc, cur) => [acc[0].concat(cur[0]), acc[1].concat(cur[1])], [[], []] as Array<Array<LocationId>>);
};

export const calcDifference = (left: LocationId[], right: LocationId[]): number => left.reduce((acc, cur, idx) => acc + Math.abs(cur - right[idx]), 0);

export const calcSimilarity = (left: LocationId[], right: LocationId[]): number => left.reduce((acc, cur) => acc + cur * right.filter(id => id === cur).length, 0);
