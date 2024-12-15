import { Array2D, Coords } from '../array2d';
import { readFileByLine } from '../fs';

type Robot = {
    position: Coords;
    velocity: Coords;
};

const parseRobot = (info: string): Robot => {
    const [a, b, c, d] = info.match(/[-]{0,1}\d+/gu)!;

    return { position: { i: Number(b), j: Number(a) }, velocity: { i: Number(d), j: Number(c) } };
};

export const loadFromFile = (filename: string): Robot[] => readFileByLine<Robot>(filename, parseRobot);

export const patrol = (grid: Array2D, robots: Robot[], seconds: number): Robot[] => robots.map(({ position, velocity }) => ({ position: grid.translate(position, { i: velocity.i * seconds, j: velocity.j * seconds }), velocity }));

export const safetyFactor = (grid: Array2D, robots: Robot[]): number => {
    const { i: iSize, j: jSize } = grid.getSize();
    const { i: iExclude, j: jExclude }: Coords = { i: (iSize - 1) / 2, j: (jSize - 1) / 2 };

    // eslint-disable-next-line max-statements
    const quadCount = robots.reduce<number[]>((acc, { position: { i, j } }) => {
        if (i === iExclude || j === jExclude) {
            return acc;
        }

        if (i < iExclude) {
            if (j < jExclude) {
                acc[0] += 1;
            }
            else {
                acc[1] += 1;
            }

            return acc;
        }

        if (j < jExclude) {
            acc[2] += 1;
        }
        else {
            acc[3] += 1;
        }

        return acc;
    }, Array(4).fill(0));

    return quadCount.reduce((acc, cur) => acc * cur);
};
