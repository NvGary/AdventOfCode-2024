import { Coords, Direction, StringArray2D } from '../array2d';

export const enum Legend {
    START = 'S',
    END = 'E',
    WALL = '#',
}

export type Options = Partial<{
    start: Coords;
    end: Coords;
}>;

export type Path = {
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

export abstract class MazeBase {
    protected grid: StringArray2D;
    private findPathIndexPredicate: Parameters<Path[]['findIndex']>[0];
    private solutions: Solution[];
    private eliminated: Coords[];

    protected constructor(grid: StringArray2D, findPathIndexPredicate: Parameters<Path[]['findIndex']>[0]) {
        this.grid = new StringArray2D().loadFromData(grid.grid);
        this.findPathIndexPredicate = findPathIndexPredicate;
        this.solutions = [];
        this.eliminated = [];
    }

    protected abstract explore(path: Path): Path[];

    // eslint-disable-next-line max-statements
    public solve(options?: Options): Solution[] {
        const { start, end } = {
            start: this.grid.find(Legend.START),
            end: this.grid.find(Legend.END),
            ...options
        };

        this.solutions = [];
        this.eliminated = [];

        if (!(this.grid.mark(start, Legend.START) && this.grid.mark(end, Legend.END))) {
            return [];
        }

        // Special case => START === END
        if (this.grid.at(start) === Legend.END) {
            return [{ cost: { corners: 0, steps: 0 }, route: [end!], mergedRoutes: [] }];
        }

        const paths: Path[][] = [[
            { pos: start!, facing: Direction.EAST, cost: { corners: 0, steps: 0 }, route: [start!], mergedRoutes: [] },
            { pos: start!, facing: Direction.SOUTH, cost: { corners: 1, steps: 0 }, route: [start!], mergedRoutes: [] },
            { pos: start!, facing: Direction.WEST, cost: { corners: 2, steps: 0 }, route: [start!], mergedRoutes: [] },
            { pos: start!, facing: Direction.NORTH, cost: { corners: 1, steps: 0 }, route: [start!], mergedRoutes: [] }
        ]];

        while (this.solutions.length === 0 && paths[0].length) {
            const oldPaths = paths.pop() ?? [];
            this.eliminated.push(...oldPaths.map(({ pos }) => pos));

            const newPaths = oldPaths.flatMap(this.explore.bind(this));
            paths.push(this.removeEliminated(newPaths.sort((a, b) => a.pos.i - b.pos.j && a.pos.j - b.pos.j && a.facing - b.facing && a.cost.corners - b.cost.corners && a.cost.steps - b.cost.steps).filter((value: Path, index: number, array: Path[]) => {
                const resIndex: number = this.findPathIndexPredicate(value, index, array) as number;
                if (resIndex !== index) {
                    if (value.cost.corners === array[resIndex].cost.corners && value.cost.steps === array[resIndex].cost.steps) {
                        array[resIndex].mergedRoutes.push(value.route);
                    }
                }
                return resIndex === index;
            })));
        }

        return this.solutions;
    }

    private removeEliminated(paths: Path[]): Path[] {
        return paths.filter(({ pos }) => this.eliminated.some(ePos => ePos.i === pos.i && ePos.j === pos.j) === false);
    }

    protected getAvailableTurns(pos: Coords, facing: Direction): Direction[] {
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

    protected setSolution(solution: Solution): void {
        this.solutions.push(solution);
    }
}
