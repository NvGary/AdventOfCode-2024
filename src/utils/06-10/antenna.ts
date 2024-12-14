import { type Coords, StringArray2D, onlyUniqueCoords } from '../array2d';

export const loadFromFile = (filename: string): StringArray2D => {
    const grid = new StringArray2D();
    grid.loadFromFile(filename);

    return grid;
};

type Antenna = { frequency: string; locations: Coords[] };

export const identify = (grid: ReturnType<typeof loadFromFile>): Antenna[] => {
    const locs: Record<string, Coords[]> = {};
    const size = grid.getSize();

    for (let i = 0; i < size.i; ++i) {
        for (let j = 0; j < size.j; ++j) {
            const pos = { i, j };
            const frequency = grid.at(pos)!;
            if (frequency !== '.') {
                locs[frequency] ||= [];
                locs[frequency].push(pos);
            }
        }
    }

    return Object.entries(locs).map(([frequency, locations]) => ({ frequency, locations }));
};

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

export const findAntinodes = (grid: ReturnType<typeof loadFromFile>, antennas: Antenna[], enableProjections: boolean = false) => {
    const { i: iMax, j: jMax } = grid.getSize();

    return antennas.map<Coords[]>(({ locations }) => {
        const antinodes: Coords[] = [];

        for (let k = 0; k < locations.length - 1; ++k) {
            const kLoc = locations[k];
            for (let l = k + 1; l < locations.length; ++l) {
                const lLoc = locations[l];
                const offset = ((left: Coords, right: Coords): Coords => ({ i: right.i - left.i, j: right.j - left.j }))(kLoc, lLoc);

                antinodes.push(...((left: Coords, right: Coords, transpose: Coords): Coords[] => (enableProjections
                    ? [
                        ...applyTranspose(left, transpose, { i: iMax - 1, j: jMax - 1 }),
                        ...applyTranspose(right, { i: transpose.i * -1, j: transpose.j * -1 }, { i: iMax - 1, j: jMax - 1 })]
                    : [
                        { i: right.i + transpose.i, j: right.j + transpose.j },
                        { i: left.i - transpose.i, j: left.j - transpose.j }
                    ]).filter(({ i, j }) => i >= 0 && i < iMax && j >= 0 && j < jMax))(kLoc, lLoc, offset));
            }
        }

        return antinodes;
    }).flat().filter(onlyUniqueCoords);
};
