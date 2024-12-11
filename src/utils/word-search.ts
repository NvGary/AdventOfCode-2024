import { type Coords, StringArray2D } from './array2d';

export const loadFromFile = (filename: string): StringArray2D => {
    const grid = new StringArray2D();
    grid.loadFromFile(filename);

    return grid;
};

// eslint-disable-next-line max-statements
const match = ({ grid }: ReturnType<typeof loadFromFile>, { i, j }: Coords, word: string): number => {
    const matches: typeof grid = [];

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

export const search = (grid: ReturnType<typeof loadFromFile>, word: string): number => {
    const l = word.charAt(0);
    let counter = 0;
    const { i: iBounds, j: jBounds } = grid.getSize();

    for (let i = 0; i < iBounds; ++i) {
        for (let j = 0; j < jBounds; ++j) {
            if (grid.at({ i, j }) === l) {
                counter += match(grid, { i, j }, word);
            }
        }
    }

    return counter;
};
