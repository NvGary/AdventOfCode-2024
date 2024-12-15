import { applyMovements, loadFromFile, sumBoxPositions } from './warehouse';
import { Direction } from '../array2d';

describe('warehouse utils', () => {
    let warehouse: ReturnType<typeof loadFromFile>;

    beforeEach(() => {
        warehouse = loadFromFile('./lib/11-15/test/warehouse.txt');
    });

    describe('function loadFromFile', () => {
        it('loads data correctly', () => {
            const { layout, movement } = warehouse;

            expect(layout.grid).toEqual([
                ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
                ['#', '.', '.', 'O', '.', '.', 'O', '.', 'O', '#'],
                ['#', '.', '.', '.', '.', '.', '.', 'O', '.', '#'],
                ['#', '.', 'O', 'O', '.', '.', 'O', '.', 'O', '#'],
                ['#', '.', '.', 'O', '@', '.', '.', 'O', '.', '#'],
                ['#', 'O', '#', '.', '.', 'O', '.', '.', '.', '#'],
                ['#', 'O', '.', '.', 'O', '.', '.', 'O', '.', '#'],
                ['#', '.', 'O', 'O', '.', 'O', '.', 'O', 'O', '#'],
                ['#', '.', '.', '.', '.', 'O', '.', '.', '.', '#'],
                ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
            ]);

            expect(movement.slice(0, 4)).toEqual([Direction.WEST, Direction.SOUTH, Direction.SOUTH, Direction.EAST]);
            expect(movement.pop()).toBe(Direction.NORTH);
        });
    });

    describe('function applyMovements', () => {
        it('applies movements correctly', () => {
            const res = applyMovements(warehouse);

            // console.log(res.grid.map(r => r.join('')).join('\n'));

            expect(res.grid).toEqual([
                ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
                ['#', '.', 'O', '.', 'O', '.', 'O', 'O', 'O', '#'],
                ['#', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
                ['#', 'O', 'O', '.', '.', '.', '.', '.', '.', '#'],
                ['#', 'O', 'O', '@', '.', '.', '.', '.', '.', '#'],
                ['#', 'O', '#', '.', '.', '.', '.', '.', 'O', '#'],
                ['#', 'O', '.', '.', '.', '.', '.', 'O', 'O', '#'],
                ['#', 'O', '.', '.', '.', '.', '.', 'O', 'O', '#'],
                ['#', 'O', 'O', '.', '.', '.', '.', 'O', 'O', '#'],
                ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
            ]);
        });
    });

    describe('function sumBoxPositions', () => {
        it('calculates properly', () => {
            const res = sumBoxPositions(applyMovements(warehouse));

            expect(res).toBe(10092);
        });
    });
});
