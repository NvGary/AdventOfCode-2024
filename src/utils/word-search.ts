import { readFileByLine } from './fs';

type Letter = string;
type Grid = Letter[][];

export const loadFromFile = (filename: string): Grid => readFileByLine<Grid>(filename, line => [Array.from(line)]);

interface Coords { i: number; j: number }

// eslint-disable-next-line max-statements
const match = (grid: Grid, { i, j }: Coords, word: string): number => {
    const matches: Letter[][] = [];

    // N
    if (j + 1 >= word.length) {
        matches.push([grid[i][j], grid[i][j - 1], grid[i][j - 2], grid[i][j - 3]]);

        // NE
        if (i + word.length <= grid[i].length) {
            matches.push([grid[i][j], grid[i + 1][j - 1], grid[i + 2][j - 2], grid[i + 3][j - 3]]);
        }
        // NW
        if (i + 1 >= word.length) {
            matches.push([grid[i][j], grid[i - 1][j - 1], grid[i - 2][j - 2], grid[i - 3][j - 3]]);
        }
    }
    // E
    if (i + word.length <= grid[i].length) {
        matches.push([grid[i][j], grid[i + 1][j], grid[i + 2][j], grid[i + 3][j]]);
    }
    // S
    if (j + word.length <= grid[j].length) {
        matches.push([grid[i][j], grid[i][j + 1], grid[i][j + 2], grid[i][j + 3]]);

        // SE
        if (i + word.length <= grid[i].length) {
            matches.push([grid[i][j], grid[i + 1][j + 1], grid[i + 2][j + 2], grid[i + 3][j + 3]]);
        }
        // SW
        if (i + 1 >= word.length) {
            matches.push([grid[i][j], grid[i - 1][j + 1], grid[i - 2][j + 2], grid[i - 3][j + 3]]);
        }
    }
    // W
    if (i + 1 >= word.length) {
        matches.push([grid[i][j], grid[i - 1][j], grid[i - 2][j], grid[i - 3][j]]);
    }

    return matches.filter(c => c.join('') === word).length;
};

export const search = (grid: Grid, word: string): number => {
    const l = word.charAt(0);
    let counter = 0;
    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[i].length; ++j) {
            if (grid[i][j] === l) {
                counter += match(grid, { i, j }, word);
            }
        }
    }

    return counter;
};
