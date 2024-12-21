import { Legend, MazeBase, type Path } from './mazeBase';
import { onlyUniqueCoords, StringArray2D } from '../array2d';

const findPathIndex = (value: Path, _: number, array: Path[]): number => array.findIndex(({ pos: { i, j }, }) => i === value.pos.i && j === value.pos.j);

export class StepPriorityMaze extends MazeBase {
    constructor(grid: StringArray2D) {
        super(grid, findPathIndex);
    }

    protected explore(path: Path): Path[] {
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
                    // This.setSolution({ cost: { ...path.cost, steps }, route, mergedRoutes: path.mergedRoutes.map(m => m.concat([])) });
                    this.setSolution({ cost: { ...path.cost, steps }, route: route.filter(onlyUniqueCoords), mergedRoutes: path.mergedRoutes.map(m => m.concat([]).filter(onlyUniqueCoords)) });
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
}
