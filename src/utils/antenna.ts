import { readFileByLine } from './fs';

type Letter = string;
type Grid = Letter[][];

export const loadFromFile = (filename: string): Grid => readFileByLine<Grid>(filename, line => [Array.from(line)]);

type Coords = { i: number; j: number };

type Antenna = { frequency: string; locations: Coords[] };

export const identify = (grid: Grid): Antenna[] => {
    const locs: Record<string, Coords[]> = {};

    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[i].length; ++j) {
            const frequency = grid[i][j];
            if (frequency !== '.') {
                locs[frequency] ||= [];
                locs[frequency].push({ i, j });
            }
        }
    }

    return Object.entries(locs).map(([frequency, locations]) => ({ frequency, locations }));
};

const onlyUniqueCoords = (value: Coords, index: number, array: Coords[]): boolean => array.findIndex(({ i, j }) => i === value.i && j === value.j) === index;

const applyTranspose = (value: Coords, transpose: Coords, boundaries: Coords): Coords[] => {
    const applied = [];
    const { i: iMax, j: jMax } = boundaries;
    let { i, j } = value;
    while (i >= 0 && i <= iMax && j >= 0 && j <= jMax) {
        i += transpose.i;
        j += transpose.j;

        applied.push({ i, j });
    }

    return applied;
};

export const findAntinodes = (grid: Grid, antennas: Antenna[], enableProjections: boolean = false) => {
    const iMax = grid.length - 1;
    const jMax = grid[0].length - 1;

    return antennas.map<Coords[]>(({ locations }) => {
        const antinodes: Coords[] = [];

        for (let k = 0; k < locations.length - 1; ++k) {
            const kLoc = locations[k];
            for (let l = k + 1; l < locations.length; ++l) {
                const lLoc = locations[l];
                const offset = ((left: Coords, right: Coords): Coords => ({ i: right.i - left.i, j: right.j - left.j }))(kLoc, lLoc);

                antinodes.push(...((left: Coords, right: Coords, transpose: Coords): Coords[] => (enableProjections
                    ? [
                        ...applyTranspose(left, transpose, { i: iMax, j: jMax }),
                        ...applyTranspose(right, { i: transpose.i * -1, j: transpose.j * -1 }, { i: iMax, j: jMax })]
                    : [
                        { i: right.i + transpose.i, j: right.j + transpose.j },
                        { i: left.i - transpose.i, j: left.j - transpose.j }
                    ]).filter(({ i, j }) => i >= 0 && i <= iMax && j >= 0 && j <= jMax))(kLoc, lLoc, offset));
            }
        }

        return antinodes;
    }).flat().filter(onlyUniqueCoords);
};
