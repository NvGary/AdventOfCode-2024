import { readFileByLine } from '../fs';

export type Grid<T> = T[][];
export type Coords = { i: number; j: number };

export const enum Direction {
    NORTH,
    EAST,
    SOUTH,
    WEST
}

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

    private validateBounds({ i, j }: Coords): boolean {
        return i >= 0 && i <= this.size.i - 1 && j >= 0 && j <= this.size.j - 1;
    }

    public getSize(): Coords {
        return this.size;
    }

    public find(item: T): Coords {
        const i = this.impl.findIndex(row => row.includes(item));
        const j = this.impl[i].findIndex(col => col === item);

        return { i, j };
    }

    public contains(items: T[]): boolean {
        const searchString = items.join('');
        return this.grid.flat().join('').includes(searchString);
    }

    public at(coords: Coords): T | null {
        if (this.validateBounds(coords) === false) {
            return null;
        }

        // console.log({ coords });
        return this.impl[coords.i][coords.j];
    }

    public mark(coords: Coords, value: T): void {
        if (this.validateBounds(coords) === false) {
            return;
        }

        this.impl[coords.i][coords.j] = value;
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
}

export const onlyUniqueCoords = (value: Coords, index: number, array: Coords[]): boolean => array.findIndex(({ i, j }) => i === value.i && j === value.j) === index;
