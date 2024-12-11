import { Coords } from './array2d';
import { type loadFromFile } from './word-search';

const match = ({ grid }: ReturnType<typeof loadFromFile>, { i, j }: Coords, word: string): number => {
    const matches: typeof grid = [];

    // NE - SW axis
    matches.push([grid[i + 1][j + 1], grid[i][j], grid[i - 1][j - 1]]);
    matches.push([grid[i - 1][j - 1], grid[i][j], grid[i + 1][j + 1]]);

    // NW - SE axis
    matches.push([grid[i - 1][j + 1], grid[i][j], grid[i + 1][j - 1]]);
    matches.push([grid[i + 1][j - 1], grid[i][j], grid[i - 1][j + 1]]);

    return matches.filter(c => c.join('') === word).length === 2 ? 1 : 0;
};

export const search = (grid: ReturnType<typeof loadFromFile>, word: string): number => {
    const l = word.charAt(1);
    let counter = 0;
    const { i: iBounds, j: jBounds } = grid.getSize();

    for (let i = 1; i < iBounds - 1; ++i) {
        for (let j = 1; j < jBounds - 1; ++j) {
            if (grid.at({ i, j }) === l) {
                counter += match(grid, { i, j }, word);
            }
        }
    }

    return counter;
};
