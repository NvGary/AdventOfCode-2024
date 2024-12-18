import { StringArray2D } from '../array2d';
import { Legend, MazeBase, Path } from '../maze';

export const loadFromFile = (filename: string): StringArray2D => new StringArray2D().loadFromFile(filename);

const findPathIndexPredicate = (value: Path, _: number, array: Path[]): number => array.findIndex(({ pos: { i, j }, facing }) => i === value.pos.i && j === value.pos.j && facing === value.facing);

export class CornerPriorityMaze extends MazeBase {
    constructor(grid: StringArray2D) {
        super(grid, findPathIndexPredicate);
    }

    // eslint-disable-next-line max-statements
    protected explore(path: Path): Path[] {
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
}
