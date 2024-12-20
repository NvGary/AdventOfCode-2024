import { type Coords } from '../array2d';

export const coordsToString = ({ i, j }: Coords): string => `(${i},${j})`;
export const mapCoordsToString = (coords: Coords[]): string[] => coords.map(coordsToString);

type cb<T> = () => T;

export const timings = <T>(fn: cb<T>): T => {
    const t0 = performance.now();
    const res = fn();

    const t1 = performance.now();
    console.log(`\tSolution took ${t1 - t0} milliseconds\n`);

    return res;
};
