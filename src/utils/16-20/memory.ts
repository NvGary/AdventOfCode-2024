import { type Coords, StringArray2D } from '../array2d';
import { readFileByLine } from '../fs';
import { type Options as MazeOptions, StepPriorityMaze } from '../maze';

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
