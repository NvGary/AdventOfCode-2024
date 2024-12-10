import { type Coords, Direction, Map } from './map';

export const getTrailHeads = (map: Map<number>): Coords[] => {
    const trailHeads = [];

    const { i: iBounds, j: jBounds } = map.getBounds();
    for (let i = 0; i <= iBounds; ++i) {
        for (let j = 0; j <= jBounds; ++j) {
            if (map.at({ i, j }) === 0) {
                trailHeads.push({ i, j });
            }
        }
    }

    return trailHeads;
};

type Trail = { begin: Coords; end: Coords };

const onlyUniqueCoords = (value: Coords, index: number, array: Coords[]): boolean => array.findIndex(({ i, j }) => i === value.i && j === value.j) === index;

export const findTrails = (map: Map<number>, trailHeads: Coords[], filterUnique: boolean = false): Trail[] => {
    const trails = trailHeads.map(trailHead => {
        const topologies: Record<number, Array<Coords>> = { 0: [trailHead] };
        for (let topology = 1; topology <= 9; ++topology) {
            const next = topologies[topology - 1].map<Array<Coords | null>>(
                pos => [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST].map<Coords | null>(
                    direction => map.move(pos, direction)
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
