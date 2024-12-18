import { Coords, StringArray2D } from '../array2d';
import { readFileByLine } from '../fs';

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
