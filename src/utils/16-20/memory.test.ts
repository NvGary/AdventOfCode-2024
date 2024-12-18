import { corrupt, CORRUPT, FREEMEM, loadFromFile } from './memory';
import { Maze, MazeAlgorithm } from './maze';
import { onlyUniqueCoords, StringArray2D } from '../array2d';

describe('memory utils', () => {
    let bytes: ReturnType<typeof loadFromFile>;

    beforeEach(() => {
        bytes = loadFromFile('./lib/16-20/test/bytes.txt');
    });

    describe('function loadFromFile', () => {
        it('loads byte drops from file', () => {
            expect(bytes).toHaveLength(25);
            expect(bytes[0]).toEqual({ i: 4, j: 5 });
            expect(bytes[1]).toEqual({ i: 2, j: 4 });
            expect(bytes.pop()!).toEqual({ i: 0, j: 2 });
        });
    });

    describe('function corrupt', () => {
        it('corrupts memory', () => {
            const memory = new StringArray2D().fill({ i: 7, j: 7 }, FREEMEM);
            expect(memory.findAll(CORRUPT)).toHaveLength(0);

            const corrupted = corrupt(memory, bytes);
            expect(corrupted.findAll(CORRUPT).length).toBeGreaterThan(0);
            expect(corrupted.findAll(CORRUPT)).toHaveLength(bytes.length);
        });

        it('corrupts memory to a maximum corrution level', () => {
            const memory = new StringArray2D().fill({ i: 7, j: 7 }, FREEMEM);
            const corrupted = corrupt(memory, bytes, 12);
            expect(corrupted.findAll(CORRUPT)).toHaveLength(12);
        });

        it('corrupts the correct bytes', () => {
            const memory = new StringArray2D().fill({ i: 7, j: 7 }, FREEMEM);
            const corrupted = corrupt(memory, bytes, 12);

            expect(corrupted.grid).toEqual([
                [FREEMEM, FREEMEM, FREEMEM, CORRUPT, FREEMEM, FREEMEM, FREEMEM],
                [FREEMEM, FREEMEM, CORRUPT, FREEMEM, FREEMEM, CORRUPT, FREEMEM],
                [FREEMEM, FREEMEM, FREEMEM, FREEMEM, CORRUPT, FREEMEM, FREEMEM],
                [FREEMEM, FREEMEM, FREEMEM, CORRUPT, FREEMEM, FREEMEM, CORRUPT],
                [FREEMEM, FREEMEM, CORRUPT, FREEMEM, FREEMEM, CORRUPT, FREEMEM],
                [FREEMEM, CORRUPT, FREEMEM, FREEMEM, CORRUPT, FREEMEM, FREEMEM],
                [CORRUPT, FREEMEM, CORRUPT, FREEMEM, FREEMEM, FREEMEM, FREEMEM],
            ]);
        });
    });

    describe('memory corruption is a solveable maze', () => {
        it('calculates 22 steps', () => {
            const memory = new StringArray2D().fill({ i: 7, j: 7 }, FREEMEM);
            const corrupted = corrupt(memory, bytes, 12);

            const maze = new Maze(corrupted);
            const [{ route }] = maze.solve({ start: { i: 0, j: 0 }, end: { i: 6, j: 6 }, useAlgorithm: MazeAlgorithm.MINIMUM_PATH }).sort(({ cost: { steps: a } }, { cost: { steps: b } }) => a - b);

            expect(route.filter(onlyUniqueCoords)).toHaveLength(22);
        });
    });
});
