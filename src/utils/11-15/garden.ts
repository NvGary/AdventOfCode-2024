import { Array2D, type Coords, Direction } from '../array2d';
import { onlyUniqueCoords } from '../array2d/array2d';

type Plot = {
    plantName: string;
    coords: Coords[];
};
type Plant = {
    name: string;
    plot?: Plot;
};
type Garden = Array2D<Plant>;

export const loadFromFile = (filename: string): Garden => {
    const garden = new Array2D<Plant>(name => ({ name }));
    garden.loadFromFile(filename);

    return garden;
};

const isPlot = ({ plot }: Plant): boolean => Boolean(plot);

const findUnallocated = (garden: Garden, plantName: Plant['name'], pos: Coords): { direction: Direction; pos: Coords }[] =>
    [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST].map(direction =>
        ({ direction, plant: garden.peek(pos, direction) }))
        .filter(({ plant }) => plant && plant.name === plantName && Boolean(plant.plot) === false)
        .map(({ direction }) => ({ direction, pos })) as Required<{ direction: Direction; pos: Coords }[]>;

// eslint-disable-next-line func-style
function expand(this: Plot, garden: Garden): Plot {
    const unallocated: ReturnType<typeof findUnallocated> = findUnallocated(garden, this.plantName, this.coords[0]);
    // console.log({ unallocated, plantName: this.plantName, pos: this.coords[0] });
    // console.log({ peeks: [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST].map(direction =>
    //     ({ direction, plant: garden.peek(this.coords[0], direction) })) });
    // console.log({ peeks: [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST].map(direction =>
    //     ({ direction, plant: garden.peek(this.coords[0], direction) }))
    //     .filter(({ plant }) => plant && plant.name === this.plantName && Boolean(plant.plot) === false) });

    while (unallocated.length) {
        const { direction, pos: from } = unallocated.pop()!;
        const pos = garden.step(from, direction)!;

        this.coords.push(pos);
        garden.at(pos)!.plot = this;

        unallocated.push(...findUnallocated(garden, this.plantName, pos));
    }

    this.coords = this.coords.filter(onlyUniqueCoords);
    return this;
};

// eslint-disable-next-line max-statements
export const findPlots = (garden: Garden): Plot[] => {
    const plots = [];
    const { i: iBounds, j: jBounds } = garden.getSize();

    for (let i = 0; i < iBounds; ++i) {
        for (let j = 0; j < jBounds; ++j) {
            const pos = { i, j };
            const plant = garden.at(pos)!;
            if (isPlot(plant) === false) {
                const plot = { coords: [pos], plantName: plant.name };
                plant.plot = plot;

                expand.bind(plot)(garden);
                // console.log({ plot });
                plots.push(plot);
            }
        }
    }

    return plots;
};

export const calcPerimeter = ({ coords, plantName }: Plot, garden: Garden): number => {
    const perimeter = coords.reduce((acc, cur) => {
        const add = [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST].map(
            direction => garden.peek(cur, direction)).filter(
            plant => plant?.name !== plantName).length;

        // console.log({ acc, cur, add });
        return acc + add;
    }, 0);
    return perimeter;
};

type Edge = {
    direction: Direction;
    position: Coords;
};
type Edges = Edge[];

const sortHorizontalEdges = (a: Edge, b: Edge) => a.direction - b.direction || a.position.i - b.position.i || a.position.j - b.position.j;
const sortVerticalEdges = (a: Edge, b: Edge) => a.direction - b.direction || a.position.j - b.position.j || a.position.i - b.position.i;

const distinctHorizontalEdges = (value: Edge, index: number, array: Edges): boolean => {
    if (index === 0) {
        return true;
    }
    const { i, j } = value.position;
    const { i: iPrev, j: jPrev } = array[index - 1].position;

    if (i !== iPrev) {
        return true;
    }
    return j - jPrev > 1;
};

const distinctVerticalEdges = (value: Edge, index: number, array: Edges): boolean => {
    if (index === 0) {
        return true;
    }
    const { i, j } = value.position;
    const { i: iPrev, j: jPrev } = array[index - 1].position;

    if (j !== jPrev) {
        return true;
    }
    return i - iPrev > 1;
};

const distinctEdges = (edges: Edges): Edges => {
    const distinctNorth = edges.filter(edge => edge.direction === Direction.NORTH).sort(sortHorizontalEdges).filter(distinctHorizontalEdges);
    const distinctEast = edges.filter(edge => edge.direction === Direction.EAST).sort(sortVerticalEdges).filter(distinctVerticalEdges);
    const distinctSouth = edges.filter(edge => edge.direction === Direction.SOUTH).sort(sortHorizontalEdges).filter(distinctHorizontalEdges);
    const distinctWest = edges.filter(edge => edge.direction === Direction.WEST).sort(sortVerticalEdges).filter(distinctVerticalEdges);

    return [...distinctNorth, ...distinctSouth, ...distinctEast, ...distinctWest];
};

export const countEdges = ({ coords, plantName }: Plot, garden: Garden): number => {
    const allEdges = coords.reduce<Edges>((acc, cur) => {
        const edges = [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST].map(
            direction => ({ direction, plant: garden.peek(cur, direction), position: cur })).filter(
            ({ plant }) => plant?.name !== plantName).map<Edge>(({ direction, position }) => ({ direction, position }));

        return acc.concat(edges);
    }, [] as Edges);

    return distinctEdges(allEdges).length;
};
