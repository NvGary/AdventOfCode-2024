import { Array2D } from './array2d';
export { type Coords } from './array2d';

const toString = (string: string): string => string.toString();

export class StringArray2D extends Array2D<string> {
    constructor() {
        super(toString);
    }
}
