import { readFileByLine } from "./fs";

type Letter = string;
type Grid = Letter[][];

export const loadFromFile = (filename: string): Grid => readFileByLine<Grid>(filename, line => [Array.from(line)])

interface Coords { i: number, j: number }

const findStart = (map: Grid): Coords => {
    const i = map.findIndex(row => row.includes('^'));
    const j = map[i].findIndex(col => col === '^');
    
    // console.log(`start position is: {${i},${j}}`);
    return {i, j};
}

const enum Direction {
    NORTH,
    EAST,
    SOUTH,
    WEST
}

const walk: Array<(coords: Coords) => Coords> = [
    ({i,j}) => ({i: i-1,j}),
    ({i,j}) => ({i, j: j+1}),
    ({i,j}) => ({i: i+1,j}),
    ({i,j}) => ({i, j: j-1})
];

// eslint-disable-next-line max-statements
export const advanceTime = (map: Grid, noTrace: boolean = false): { map: Grid, isLooping: boolean } => {
    let direction = Direction.NORTH;
    // eslint-disable-next-line no-useless-assignment
    let rotated = false;
    let position: Coords = findStart(map);
    const path: Array<{coords: Coords, direction: Direction}> = [];
    const markMap = (coords: Coords, direction: Direction): boolean => {
        const {i,j} = coords;
        const dejavu = path.some(({ coords: { i: vi, j: vj }, direction: vDirection }) => vDirection === direction && vi === i && vj === j);
        if (noTrace === false && map[i][j] !== '^') {
            map[i][j] = 'X';
        }
        if (!dejavu) {
            path.push({ coords, direction });
        }

        return dejavu;
    }
    let dejavu = markMap(position, direction);

    const isComplete = (coords: Coords, direction: Direction): boolean => {
        const {i,j} = walk[direction](coords);
        // console.log({ fn: 'isComplete', i, j });
        return i < 0 || j < 0 || i >= map.length || j >= map[0].length;
    }
    const queryRotate = (coords: Coords, direction: Direction): { rotated: boolean, direction: Direction } => {
        const {i,j} = walk[direction](coords);
        // console.log({ fn: 'queryRotate', i, j, direction });

        if (i < 0 || j < 0 || i >= map.length || j >= map[0].length) {
            return {rotated: false, direction};
        } else if (['#', 'O'].includes(map[i][j])) {
            return {rotated: true, direction: (direction + 1) % 4 as Direction};
        } else {
            return {rotated: false, direction};
        }
    }

    while (!dejavu && !isComplete(position, direction)) {
        ({ rotated, direction } = queryRotate(position, direction));
        if (!rotated) {
            position = walk[direction](position);
        }
        dejavu = markMap(position, direction);
    }

    return { map, isLooping: dejavu };
}

export const createDejavu = (map: Grid): number => {
    let count = 0;

    for (let i = 0; i < map.length; ++i) {
        for (let j = 0; j < map[i].length; ++j) {
            if (map[i][j] === 'X') {
                map[i][j] = 'O';
                const { isLooping } = advanceTime(map, true);
                map[i][j] = 'X';

                if (isLooping) {
                    count++;
                    // console.log(`--- LOOPING ${count} ---`);
                }
            }
        }
    }

    return count;
}

export const countVisited = (map: Grid): number => map.reduce((acc, row) => acc + row.filter(col => ['X', '^'].includes(col)).length, 0);
