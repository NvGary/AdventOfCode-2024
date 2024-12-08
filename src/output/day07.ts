import { OPERATORS, type Operator, loadFromFile, splitCorrect } from '../utils/calibration';

// eslint-disable-next-line max-statements
export const day07 = () => {
    console.log('--- Day 7: Bridge Repair ---');

    const calibrations = loadFromFile('./lib/calibrations.txt');

    // 12839601725877
    const { correct, incorrect } = splitCorrect(calibrations);
    console.log(`Total calibration result: ${correct.reduce<number>((acc, { value }) => acc + value, 0)}`)
    console.log(`Correct count (default): ${correct.length}`);

    const concat: Operator = (a,b) => parseInt(`${a}${b}`, 10) ;
    const resConcatOp = splitCorrect(incorrect, { concat });
    correct.push(...resConcatOp.correct);
    console.log(`Correct count (op concat): ${correct.length}`);

    // ops mul + concat
    const resMulConcatOps = splitCorrect(resConcatOp.incorrect, { mul: OPERATORS.mul, concat });
    correct.push(...resMulConcatOps.correct);
    console.log(`Correct count (ops mul + concat): ${correct.length}`);

    // ops add + concat
    const resAddConcatOps = splitCorrect(resMulConcatOps.incorrect, { mul: OPERATORS.add, concat });
    correct.push(...resAddConcatOps.correct);
    console.log(`Correct count (ops add + concat): ${correct.length}`);

    // all ops
    const resAllOps = splitCorrect(resAddConcatOps.incorrect, { ...OPERATORS, concat })
    correct.push(...resAllOps.correct);
    console.log(`Correct count (all ops): ${correct.length}`);

    // 149956401519484
    console.log(`Total calibration result (includes concat operator): ${correct.reduce<number>((acc, { value }) => acc + value, 0)}`);
}
