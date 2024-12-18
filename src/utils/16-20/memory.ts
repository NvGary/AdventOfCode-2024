import { type Coords, StringArray2D } from '../array2d';
import { readFileByLine } from '../fs';
import { Legend, MazeBase, type Options as MazeOptions, type Path } from '../maze';

export const loadFromFile = (filename: string): Coords[] => readFileByLine<Coords>(filename, line => {
    const [j, i] = line.match(/[-]{0,1}\d+/gu)!.map(Number);
    return { i, j };
});

type Memory = StringArray2D;
type MemoryAddress = Coords;

export const CORRUPT = '#';
export const FREEMEM = '.';

export const corrupt = (memory: Memory, bytes: MemoryAddress[], maxCorruptions: number = bytes.length): Memory => {
    const corrupted = new StringArray2D().loadFromData(memory.grid);
    bytes.slice(0, maxCorruptions).forEach(byte => corrupted.mark(byte, CORRUPT));

    return corrupted;
};

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
}

export const solveAsMaze = (memory: Memory, mazeOptions: MazeOptions): ReturnType<typeof maze.solve>[number] | null => {
    const maze = new StepPriorityMaze(memory);

    const solutions = maze.solve({ ...mazeOptions });

    if (solutions.length) {
        return solutions.sort(({ cost: { steps: a } }, { cost: { steps: b } }) => a - b)[0];
    }

    return null;
};

// eslint-disable-next-line max-statements
export const determineMaxCorruption = (memory: Memory, bytes: MemoryAddress[], mazeOptions: MazeOptions): MemoryAddress | null => {
    let corruptedMemory = memory;
    const remainingBytes = bytes.concat();
    let { route } = solveAsMaze(memory, { ...mazeOptions })!;

    // Only coords on our path can make our maze unsolveable
    let byteIndex = remainingBytes.findIndex(byte => route.some(({ i, j }) => byte.i === i && byte.j === j));

    while (byteIndex !== -1) {
        const bytesToCorrupt = remainingBytes.splice(0, byteIndex + 1);
        corruptedMemory = corrupt(corruptedMemory, bytesToCorrupt);
        ({ route } = solveAsMaze(corruptedMemory, { ...mazeOptions }) || { route: [] });

        if (route.length === 0) {
            return bytesToCorrupt.pop()!;
        }

        byteIndex = remainingBytes.findIndex(byte => route.some(({ i, j }) => byte.i === i && byte.j === j));
    }

    return null;
};
