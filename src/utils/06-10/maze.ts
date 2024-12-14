import { type Coords, Direction, StringArray2D } from '../array2d';

export const loadFromFile = (filename: string): StringArray2D => {
    const grid = new StringArray2D();
    grid.loadFromFile(filename);

    return grid;
};

// eslint-disable-next-line max-statements
export const advanceTime = (map: ReturnType<typeof loadFromFile>, noTrace: boolean = false): { map: ReturnType<typeof loadFromFile>; isLooping: boolean } => {
    let facing = Direction.NORTH;
    // eslint-disable-next-line no-useless-assignment
    let rotated = false;
    let position: Coords = map.find('^');
    const path: Array<{ coords: Coords; direction: Direction }> = [];
    const markMap = (coords: Coords, direction: Direction): boolean => {
        const { i, j } = coords;
        const dejavu = path.some(({ coords: { i: vi, j: vj }, direction: vDirection }) => vDirection === direction && vi === i && vj === j);
        if (noTrace === false && map.at({ i, j }) !== '^') {
            map.mark({ i, j }, 'X');
        }
        if (!dejavu) {
            path.push({ coords, direction });
        }

        return dejavu;
    };
    let dejavu = markMap(position, facing);

    const isComplete = (coords: Coords, direction: Direction): boolean => map.peek(coords, direction) === null;

    const queryRotate = (coords: Coords, direction: Direction): { direction: Direction; rotated: boolean } => {
        const pos = map.step(coords, direction);

        if (pos === null) {
            return { direction, rotated: false };
        }

        if (['#', 'O'].includes(map.at(pos)!)) {
            return { direction: (direction + 1) % 4 as Direction, rotated: true };
        }

        return { direction, rotated: false };
    };

    while (!dejavu && !isComplete(position, facing)) {
        ({ rotated, direction: facing } = queryRotate(position, facing));
        if (!rotated) {
            position = map.step(position, facing)!;
        }
        dejavu = markMap(position, facing);
    }

    return { isLooping: dejavu, map };
};

// eslint-disable-next-line max-statements
export const createDejavu = (map: ReturnType<typeof loadFromFile>): number => {
    let count = 0;
    const { i: iBounds, j: jBounds } = map.getSize();

    for (let i = 0; i < iBounds; ++i) {
        for (let j = 0; j < jBounds; ++j) {
            if (map.at({ i, j }) === 'X') {
                map.mark({ i, j }, 'O');
                const { isLooping } = advanceTime(map, true);
                map.mark({ i, j }, 'X');

                if (isLooping) {
                    ++count;
                }
            }
        }
    }

    return count;
};

export const countVisited = ({ grid }: ReturnType<typeof loadFromFile>): number => grid.reduce((acc, row) => acc + row.filter(col => ['X', '^'].includes(col)).length, 0);
