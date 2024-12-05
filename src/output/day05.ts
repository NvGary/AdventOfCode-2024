import { calculateProductionTotals, correctOrdering, hasCorrectOrdering, loadFromFile } from '../utils/print-queue';

export const day05 = () => {
    console.log('--- Day 5: Print Queue ---');
  
    const data = loadFromFile('./lib/print-queue.txt');
    const production = hasCorrectOrdering(data);
    // 6612
    const subTotal = calculateProductionTotals(production);
    console.log(`Middle page numbers total to: ${subTotal}`);
    // 4944
    console.log(`[Corrected] middle page numbers total to: ${calculateProductionTotals(correctOrdering(data)) - subTotal}`)
  }
