type Letter = string;
type Grid = Letter[][];
interface Coords { i: number, j: number }

const match = (grid: Grid, { i, j }: Coords, word: string): number => {
    const matches: Letter[][] = []

    // NE - SW axis
    matches.push([grid[i+1][j+1], grid[i][j], grid[i-1][j-1]]);
    matches.push([grid[i-1][j-1], grid[i][j], grid[i+1][j+1]]);

    // NW - SE axis
    matches.push([grid[i-1][j+1], grid[i][j], grid[i+1][j-1]]);
    matches.push([grid[i+1][j-1], grid[i][j], grid[i-1][j+1]]);

    return matches.filter(c => c.join('') === word).length === 2 ? 1 : 0;
};

export const search = (grid: Grid, word: string): number => {
    const l = word.charAt(1);
    let counter = 0;
    for (let i = 1; i < grid.length - 1; ++i) {
        for (let j = 1; j < grid[i].length - 1; ++j) {
            if (grid[i][j] === l) {
                counter += match(grid, {i, j}, word);
            }
        }
    }

    return counter
};
