import { timings } from '../../utils/test/utils';
import { applyMovements, loadFromFile, sumBoxPositions } from '../../utils/11-15/warehouse';
import { applyMovements as applyMovementsX, loadFromFile as loadFromFileX, sumBoxPositions as sumBoxPositionsX } from '../../utils/11-15/warehouse-x';

export const day15 = () => {
    console.log('--- Day 15: Warehouse Woes ---');

    timings(() => {
        const warehouse = loadFromFile('./lib/11-15/warehouse.txt');

        // 1479679
        console.log(`Sum of all boxes' GPS coordinates: ${sumBoxPositions(applyMovements(warehouse))}`);
    });

    timings(() => {
        const warehouseX = loadFromFileX('./lib/11-15/warehouse.txt');

        // 1509780
        console.log(`Sum of all boxes' GPS coordinates: ${sumBoxPositionsX(applyMovementsX(warehouseX))}`);
    });
};
