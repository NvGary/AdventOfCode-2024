import { type Coords } from '../array2d';

export const mapCoordsToString = (coords: Coords[]): string[] => coords.map(({ i, j }) => `(${i},${j})`);
