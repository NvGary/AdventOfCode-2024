import { readFileByLine } from './fs';

type Grid<T> = T[][];
export type Coords = { i: number; j: number };

export const enum Direction {
    NORTH,
    EAST,
    SOUTH,
    WEST
}

const translate: Array<(coords: Coords) => Coords> = [
    ({ i, j }) => ({ i: i - 1, j }),
    ({ i, j }) => ({ i, j: j + 1 }),
    ({ i, j }) => ({ i: i + 1, j }),
    ({ i, j }) => ({ i, j: j - 1 })
];

const toString = (string: string): string => string.toString();

export class Map<T = string> {
    private grid: Grid<T> = [];
    private bounds: Coords = { i: 0, j: 0 };

    public loadFromFile(filename: string, conv: (arg0: string) => T | unknown = toString): void {
        this.grid = readFileByLine<Grid<T>>(filename, line => [Array.from(line).map(conv) as T[]]);
        this.setBounds();
    }

    private setBounds(): void {
        this.bounds = { i: this.grid.length - 1, j: this.grid[0].length - 1 };
    }

    private validateBounds({i, j}: Coords): boolean {
        return i >= 0 && i <= this.bounds.i && j >= 0 && j <= this.bounds.j;
    }

    public getBounds(): Coords {
        return this.bounds;
    }

    public at(coords: Coords): T | null {
        if (this.validateBounds(coords) === false) {
            return null;
        }

        // console.log({ coords });
        return this.grid[coords.i][coords.j];
    }

    public move(from: Coords, direction: Direction): Coords | null {
        const at = translate[direction](from);

        if (this.validateBounds(at) === false) {
            return null;
        }

        return at;
    }

    public look(from: Coords, direction: Direction): T | null {
        const at = translate[direction](from);

        if (this.validateBounds(at) === false) {
            return null;
        }

        return this.at(at);
    }
}
