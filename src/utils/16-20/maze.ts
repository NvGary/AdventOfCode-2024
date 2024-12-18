import { Coords, Direction, StringArray2D } from '../array2d';

export const loadFromFile = (filename: string): StringArray2D => new StringArray2D().loadFromFile(filename);

const enum Legend {
    START = 'S',
    END = 'E',
    WALL = '#',
}

type Path = {
    pos: Coords;
    facing: Direction;
    cost: {
        corners: number;
        steps: number;
    };
    route: Coords[];
    mergedRoutes: Coords[][];
};

type Solution = {
    cost: Path['cost'];
    route: Coords[];
    mergedRoutes: Coords[][];
};

export const onlyUniquePaths = (value: Path, index: number, array: Path[]): boolean => {
    const resIndex = array.findIndex(({ pos: { i, j }, facing }) => i === value.pos.i && j === value.pos.j && facing === value.facing);
    if (resIndex !== index) {
        if (value.cost.corners === array[resIndex].cost.corners && value.cost.steps === array[resIndex].cost.steps) {
            array[resIndex].mergedRoutes.push(value.route);
        }
    }
    return resIndex === index;
};

export enum MazeAlgorithm {
    MINIMUM_PATH,
    MINIMUM_CORNERS
}

export class Maze {
    private grid: StringArray2D;
    private solutions: Solution[];
    private eliminated: Coords[];

    public constructor(grid: StringArray2D) {
        this.grid = grid;
        this.solutions = [];
        this.eliminated = [];
    }

    // eslint-disable-next-line max-statements
    public solve({ start, end, useAlgorithm } = { start: this.grid.find(Legend.START), end: this.grid.find(Legend.END), useAlgorithm: MazeAlgorithm.MINIMUM_CORNERS }): Solution[] {
        this.solutions = [];
        this.eliminated = [];

        if (!(this.grid.mark(start, Legend.START) && this.grid.mark(end, Legend.END))) {
            return [];
        }

        const paths: Path[][] = [[
            { pos: start, facing: Direction.EAST, cost: { corners: 0, steps: 0 }, route: [start], mergedRoutes: [] },
            { pos: start, facing: Direction.SOUTH, cost: { corners: 1, steps: 0 }, route: [start], mergedRoutes: [] },
            { pos: start, facing: Direction.WEST, cost: { corners: 2, steps: 0 }, route: [start], mergedRoutes: [] },
            { pos: start, facing: Direction.NORTH, cost: { corners: 1, steps: 0 }, route: [start], mergedRoutes: [] }
        ]];

        const algorithm = useAlgorithm === MazeAlgorithm.MINIMUM_CORNERS ? this.exploreByCorners.bind(this) : this.exploreBySteps.bind(this);

        let iterations = 0;
        while (this.solutions.length === 0 && iterations < 1000) {
            const oldPaths = paths.pop() ?? [];
            this.eliminated.push(...oldPaths.map(({ pos }) => pos));

            const newPaths = oldPaths.flatMap(algorithm);
            paths.push(this.removeEliminated(newPaths.sort((a, b) => a.pos.i - b.pos.j && a.pos.j - b.pos.j && a.facing - b.facing && a.cost.corners - b.cost.corners && a.cost.steps - b.cost.steps).filter(onlyUniquePaths)));
            ++iterations;
        }

        // console.log({ solutions: this.solutions, iterations, paths: paths[0].length });

        // return [{
        //     route: paths[0][0].route,
        //     cost: paths[0][0].cost,
        //     mergedRoutes: [],
        // }];
        return this.solutions;
    }

    private removeEliminated(paths: Path[]): Path[] {
        return paths.filter(({ pos }) => this.eliminated.some(ePos => ePos.i === pos.i && ePos.j === pos.j) === false);
    }

    // eslint-disable-next-line max-statements
    private exploreByCorners(path: Path): Path[] {
        const paths: Path[] = [];

        const { facing, cost: { corners } } = path;
        let pos = { ...path.pos };
        let { steps } = path.cost;
        const route = path.route.concat([]);

        while (![null, Legend.WALL as string].includes(this.grid.peek(pos, facing))) {
            pos = this.grid.step(pos, facing)!;
            route.push(pos);
            ++steps;

            if (this.grid.at(pos) === Legend.END) {
                this.setSolution({ cost: { ...path.cost, steps }, route, mergedRoutes: path.mergedRoutes.map(m => m.concat([])) });
                return [];
            }

            paths.push(...this.getAvailableTurns(pos, facing).map<Path>(nowFacing => ({
                pos,
                facing: nowFacing,
                cost: { corners: corners + 1, steps },
                route: route.concat([]),
                mergedRoutes: path.mergedRoutes.map(m => m.concat([]))
            })));
        }
        return paths;
    }

    private exploreBySteps(path: Path): Path[] {
        const { facing, cost: { corners } } = path;
        const pos = { ...path.pos };
        const steps = path.cost.steps + 1;
        const route = path.route.concat([]);

        const availabeSteps = this.getAvailableTurns(pos, facing);
        const newPaths = availabeSteps.concat(facing).map(nowFacing => {
            if ([null, Legend.WALL as string].includes(this.grid.peek(pos, nowFacing))) {
                return null;
            }

            const newPos = this.grid.step(pos, nowFacing);
            if (newPos !== null) {
                route.push(pos);

                if (this.grid.at(newPos) === Legend.END) {
                    this.setSolution({ cost: { ...path.cost, steps }, route, mergedRoutes: path.mergedRoutes.map(m => m.concat([])) });
                    return null;
                }

                return {
                    pos: newPos,
                    facing: nowFacing,
                    cost: { corners: facing === nowFacing ? corners : corners + 1, steps },
                    route: route.concat([]),
                    mergedRoutes: path.mergedRoutes.map(m => m.concat([]))
                };
            }

            return null;
        }).filter(n => n !== null) as Path[];

        // console.log(JSON.stringify(newPaths));
        return newPaths ?? [];
    }

    private getAvailableTurns(pos: Coords, facing: Direction): Direction[] {
        const turns = [];
        const LEFT = (facing + 3) % 4;
        const RIGHT = (facing + 1) % 4;

        if (![null, Legend.WALL as string].includes(this.grid.peek(pos, LEFT))) {
            turns.push(LEFT);
        }
        if (![null, Legend.WALL as string].includes(this.grid.peek(pos, RIGHT))) {
            turns.push(RIGHT);
        }

        return turns;
    }

    private setSolution(solution: Solution): void {
        this.solutions.push(solution);
    }
}
