import { readFileByLine } from '../fs';

export type Grid<T> = T[][];
export type Coords = { i: number; j: number };

export const onlyUniqueCoords = (value: Coords, index: number, array: Coords[]): boolean => array.findIndex(({ i, j }) => i === value.i && j === value.j) === index;

export const enum Direction {
    NORTH,
    EAST,
    SOUTH,
    WEST
}

const diffToDirection = (diff: Coords): Direction => ({
    [JSON.stringify({ i: 1, j: 0 })]: Direction.NORTH,
    [JSON.stringify({ i: 0, j: -1 })]: Direction.EAST,
    [JSON.stringify({ i: -1, j: 0 })]: Direction.SOUTH,
    [JSON.stringify({ i: 0, j: 1 })]: Direction.WEST,
})[JSON.stringify(diff)];

export const distance = (from: Coords, to: Coords): number => Math.abs(from.i - to.i) + Math.abs(from.j - to.j);
const difference = (from: Coords, to: Coords): Coords => ({ i: from.i - to.i, j: from.j - to.j });

export const convertToDirections = (route: Coords[]): Direction[] => {
    const differences: Coords[] = [];
    for (let i = 1; i < route.length; ++i) {
        differences.push(difference(route[i - 1], route[i]));
    }

    return differences.map(diffToDirection);
};

const step: Array<(coords: Coords) => Coords> = [
    ({ i, j }) => ({ i: i - 1, j }),
    ({ i, j }) => ({ i, j: j + 1 }),
    ({ i, j }) => ({ i: i + 1, j }),
    ({ i, j }) => ({ i, j: j - 1 })
];

type fnConvert<T> = (v: string) => T;

export class Array2D<T = unknown> {
    private impl: Grid<T> = [];
    private size: Coords = { i: 0, j: 0 };
    private conv: fnConvert<T>;

    constructor(conv: fnConvert<T>) {
        this.conv = conv;
    }

    public get grid(): Grid<T> {
        return this.impl;
    }

    public loadFromFile(filename: string): Array2D<T> {
        this.impl = readFileByLine<T[]>(filename, line => Array.from(line).map(this.conv));
        this.setSize();

        return this;
    }

    public loadFromData(data: T[][]): Array2D<T> {
        this.impl = data.map(r => r.map(c => c));
        this.setSize();

        return this;
    }

    public fill(size: Coords, value: T): Array2D<T> {
        this.impl = Array(size.i);
        for (let i = 0; i < this.impl.length; ++i) {
            this.impl[i] = Array(size.j).fill(value);
        }
        this.setSize();

        return this;
    }

    private setSize(): void {
        this.size = { i: this.impl.length, j: this.impl[0].length };
    }

    private validateBounds(pos: Coords | null): boolean {
        if (pos === null) {
            return false;
        }

        const { i, j } = pos!;
        return i >= 0 && i <= this.size.i - 1 && j >= 0 && j <= this.size.j - 1;
    }

    public getSize(): Coords {
        return this.size;
    }

    public find(item: T): Coords | null {
        const i = this.impl.findIndex(row => row.includes(item));
        if (i === -1) {
            return null;
        }
        const j = this.impl[i].findIndex(col => col === item);
        if (j === -1) {
            return null;
        }

        return { i, j };
    }

    public findAll(item: T): Coords[] {
        const res = [];
        for (let i = 0; i < this.size.i; ++i) {
            for (let j = 0; j < this.size.j; ++j) {
                if (this.grid[i][j] === item) {
                    res.push({ i, j });
                }
            }
        }

        return res;
    }

    public contains(items: T[]): boolean {
        const searchString = items.join('');
        return this.grid.flat().join('').includes(searchString);
    }

    public at(coords: Coords | null): T | null {
        if (coords === null) {
            return null;
        }

        if (this.validateBounds(coords) === false) {
            return null;
        }

        return this.impl[coords.i][coords.j];
    }

    public mark(coords: Coords | null, value: T): boolean {
        if (this.validateBounds(coords) === false) {
            return false;
        }

        this.impl[coords!.i][coords!.j] = value;
        return true;
    }

    public step(from: Coords, direction: Direction): Coords | null {
        const at = step[direction](from);

        if (this.validateBounds(at) === false) {
            return null;
        }

        return at;
    }

    public peek(from: Coords, direction: Direction): T | null {
        const at = step[direction](from);

        if (this.validateBounds(at) === false) {
            return null;
        }

        return this.at(at);
    }

    public translate(from: Coords, translation: Coords): Coords {
        const i = (from.i + translation.i) % this.size.i;
        const j = (from.j + translation.j) % this.size.j;
        return {
            i: i < 0 ? i + this.size.i : i,
            j: j < 0 ? j + this.size.j : j,
        };
    }

    public reachable(from: Coords, steps: number): Coords[] {
        if (this.validateBounds(from) === false) {
            return [];
        }

        // Push 'from' coord - we'll uniqueify against this entry and slice this out at the end
        // Alternatively we can ignore i = 0 && j = 0 in the below loops
        const results: Coords[] = [from];

        for (let i = 0; i <= steps; ++i) {
            for (let j = 0; j <= steps - i; ++j) {
                results.push(...[
                    { i: from.i + i, j: from.j + j },
                    { i: from.i - i, j: from.j - j },
                    { i: from.i + i, j: from.j - j },
                    { i: from.i - i, j: from.j + j },
                ].filter(this.validateBounds.bind(this)));
            }
        }
        return results.filter(onlyUniqueCoords).slice(1);
    }
}
