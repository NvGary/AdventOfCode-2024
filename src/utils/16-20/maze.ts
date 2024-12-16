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

export class Maze {
    private grid: StringArray2D;
    private solutions: Solution[];

    public constructor(grid: StringArray2D) {
        this.grid = grid;
        this.solutions = [];
    }

    public solve(): Solution[] {
        this.solutions = [];
        const start = this.grid.find(Legend.START);

        const paths: Path[][] = [[
            { pos: start, facing: Direction.EAST, cost: { corners: 0, steps: 0 }, route: [start], mergedRoutes: [] },
            { pos: start, facing: Direction.SOUTH, cost: { corners: 1, steps: 0 }, route: [start], mergedRoutes: [] },
            { pos: start, facing: Direction.WEST, cost: { corners: 2, steps: 0 }, route: [start], mergedRoutes: [] },
            { pos: start, facing: Direction.NORTH, cost: { corners: 1, steps: 0 }, route: [start], mergedRoutes: [] }
        ]];

        let iterations = 0;
        while (this.solutions.length === 0 && iterations < 1000) {
            const newPaths = paths.pop()!.flatMap(this.explore.bind(this));
            paths.push(newPaths.sort((a, b) => a.pos.i - b.pos.j && a.pos.j - b.pos.j && a.facing - b.facing && a.cost.corners - b.cost.corners && a.cost.steps - b.cost.steps).filter(onlyUniquePaths));
            ++iterations;
        }

        return this.solutions;
    }

    // eslint-disable-next-line max-statements
    private explore(path: Path): Path[] {
        const paths: Path[] = [];

        const { facing, cost: { corners } } = path;
        let pos = { ...path.pos };
        let { steps } = path.cost;
        const route = path.route.concat([]);

        while (this.grid.peek(pos, facing) !== Legend.WALL) {
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

    private getAvailableTurns(pos: Coords, facing: Direction): Direction[] {
        const turns = [];
        const LEFT = (facing + 3) % 4;
        const RIGHT = (facing + 1) % 4;

        if ((this.grid.peek(pos, LEFT) !== Legend.WALL)) {
            turns.push(LEFT);
        }
        if ((this.grid.peek(pos, RIGHT) !== Legend.WALL)) {
            turns.push(RIGHT);
        }

        return turns;
    }

    private setSolution(solution: Solution): void {
        this.solutions.push(solution);
    }
}
