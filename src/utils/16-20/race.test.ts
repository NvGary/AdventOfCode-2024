import { findShortcuts, loadFromFile, solveAsMaze } from './race';
import { Coords, StringArray2D } from '../array2d';
import { timings } from '../../utils/test/utils';

describe('race utils', () => {
    describe('function loadFromFile', () => {
        const spies = {
            StringArray2D: {
                loadFromFile: jest.spyOn(StringArray2D.prototype, 'loadFromFile')
            }
        };

        afterEach(() => {
            spies.StringArray2D.loadFromFile.mockClear();
        });

        afterAll(() => {
            spies.StringArray2D.loadFromFile.mockRestore();
        });

        it('defers to StringArrray2d', () => {
            const FILENAME = './lib/16-20/test/racetrack.txt';
            loadFromFile(FILENAME);

            expect(spies.StringArray2D.loadFromFile).toHaveBeenCalledWith(FILENAME);
        });

        it('regurgitates StringArrray2d data', () => {
            const data = loadFromFile('./lib/16-20/test/racetrack.txt');

            expect(data).toBe(spies.StringArray2D.loadFromFile.mock.results[0].value);
        });
    });

    describe('function solveAsMaze', () => {
        it('solves the maze', () => {
            const data = loadFromFile('./lib/16-20/test/racetrack.txt');

            const res = solveAsMaze(data);
            expect(res?.cost.steps).toBe(84);
        });
    });

    describe('function findShortcuts', () => {
        it('finds the right amonut of shortcuts', () => {
            const data = loadFromFile('./lib/16-20/test/racetrack.txt');

            const shortcuts = findShortcuts(data);
            // console.log(JSON.stringify(shortcuts));
            expect(shortcuts).toHaveLength(44);
        });

        it('finds all expected shortcuts', () => {
            const data = loadFromFile('./lib/16-20/test/racetrack.txt');

            const shortcuts: Record<string, ReturnType<typeof findShortcuts>[number]['coords'][]> = findShortcuts(data).reduce((acc, cur) => {
                const { coords: shortcut, saving } = cur;
                acc[String(saving)] = (acc[String(saving)] ?? []).concat(shortcut);

                return {
                    ...acc
                };
            }, {} as Record<string, ReturnType<typeof findShortcuts>[number]['coords'][]>);
            expect(shortcuts['2']).toHaveLength(14);
            expect(shortcuts['4']).toHaveLength(14);
            expect(shortcuts['64']).toHaveLength(1);
        });
    });
});
