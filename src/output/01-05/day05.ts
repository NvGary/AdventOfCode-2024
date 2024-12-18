import { timings } from '../../utils/test/utils';
import { calculateProductionTotals, correctOrdering, hasCorrectOrdering, loadFromFile } from '../../utils/01-05/print-queue';

export const day05 = () => {
    console.log('--- Day 5: Print Queue ---');

    const data = loadFromFile('./lib/01-05/print-queue.txt');

    const subTotalFromPart1 = timings(() => {
        const production = hasCorrectOrdering(data);
        // 6612
        const subTotal = calculateProductionTotals(production);
        console.log(`Middle page numbers total to: ${subTotal}`);

        return subTotal;
    });

    timings(() => {
        // 4944
        console.log(`[Corrected] middle page numbers total to: ${calculateProductionTotals(correctOrdering(data)) - subTotalFromPart1}`);
    });
};
