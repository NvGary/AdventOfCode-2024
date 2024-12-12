import { type Coords, Direction, NumberArray2D } from './array2d';
import { onlyUniqueCoords } from './array2d/array2d';

export const loadFromFile = (filename: string): NumberArray2D => {
    const grid = new NumberArray2D();
    grid.loadFromFile(filename);

    return grid;
};

export const getTrailHeads = (map: ReturnType<typeof loadFromFile>): Coords[] => {
    const trailHeads = [];

    const { i: iBounds, j: jBounds } = map.getSize();
    for (let i = 0; i < iBounds; ++i) {
        for (let j = 0; j < jBounds; ++j) {
            if (map.at({ i, j }) === 0) {
                trailHeads.push({ i, j });
            }
        }
    }

    return trailHeads;
};

type Trail = { begin: Coords; end: Coords };

export const findTrails = (map: ReturnType<typeof loadFromFile>, trailHeads: Coords[], filterUnique: boolean = false): Trail[] => {
    const trails = trailHeads.map(trailHead => {
        const topologies: Record<number, Array<Coords>> = { 0: [trailHead] };
        for (let topology = 1; topology <= 9; ++topology) {
            const next = topologies[topology - 1].map<Array<Coords | null>>(
                pos => [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST].map<Coords | null>(
                    direction => map.step(pos, direction)
                )
            ).flat().filter(coords => coords && map.at(coords) === topology) as Array<Coords>;

            topologies[topology] = filterUnique ? next.filter(onlyUniqueCoords) : next;
        }

        if (topologies[9]) {
            return topologies[9].map(top => ({ begin: trailHead, end: top }));
        }

        return [];
    }).flat();
    return trails;
};
