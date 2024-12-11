import { Array2D } from './array2d';
export { type Coords } from './array2d';

const toNumber = (string: string): number => Number(string);

export class NumberArray2D extends Array2D<number> {
    constructor() {
        super(toNumber);
    }
}
