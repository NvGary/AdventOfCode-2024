import { timings } from '../../utils/test/utils';
import { loadFromFile, type Operator, OPERATORS, splitCorrect } from '../../utils/06-10/calibration';

export const day07 = () => {
    console.log('--- Day 7: Bridge Repair ---');

    const calibrations = loadFromFile('./lib/06-10/calibrations.txt');

    const { correct: correctFromPart1, incorrect: incorrectFromPart1 } = timings(() => {
        // 12839601725877
        const { correct, incorrect } = splitCorrect(calibrations);
        console.log(`Total calibration result: ${correct.reduce<number>((acc, { value }) => acc + value, 0)}`);

        return { correct, incorrect };
    });

    // eslint-disable-next-line max-statements
    timings(() => {
        console.log(`Correct count (default): ${correctFromPart1.length}`);

        const concat: Operator = (a, b) => parseInt(`${a}${b}`, 10);
        const resConcatOp = splitCorrect(incorrectFromPart1, { concat });
        correctFromPart1.push(...resConcatOp.correct);
        console.log(`Correct count (op concat): ${correctFromPart1.length}`);

        // Ops mul + concat
        const resMulConcatOps = splitCorrect(resConcatOp.incorrect, { concat, mul: OPERATORS.mul });
        correctFromPart1.push(...resMulConcatOps.correct);
        console.log(`Correct count (ops mul + concat): ${correctFromPart1.length}`);

        // Ops add + concat
        const resAddConcatOps = splitCorrect(resMulConcatOps.incorrect, { concat, mul: OPERATORS.add });
        correctFromPart1.push(...resAddConcatOps.correct);
        console.log(`Correct count (ops add + concat): ${correctFromPart1.length}`);

        // All ops
        const resAllOps = splitCorrect(resAddConcatOps.incorrect, { ...OPERATORS, concat });
        correctFromPart1.push(...resAllOps.correct);
        console.log(`Correct count (all ops): ${correctFromPart1.length}`);

        // 149956401519484
        console.log(`Total calibration result (includes concat operator): ${correctFromPart1.reduce<number>((acc, { value }) => acc + value, 0)}`);
    });
};
