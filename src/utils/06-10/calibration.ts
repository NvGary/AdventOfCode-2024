import { readFileByLine } from '../fs';

type Calibration = {
    value: number;
    ordinals: Array<number>;
};

const parseValue = (value: string): number => parseInt(value, 10);
const parseOrdinals = (ordinals: string[]): number[] => ordinals.map(ordinal => parseInt(ordinal, 10));

export const loadFromFile = (filename: string): Calibration[] => readFileByLine(filename, line => {
    const [value, rem] = line.split(':');
    const ordinals = rem.trim().split(' ');

    return { ordinals: parseOrdinals(ordinals), value: parseValue(value) };
});

export type Operator = (a: number, b: number) => number;

export const OPERATORS: Record<string, Operator> = {
    add: (a, b) => a + b,
    mul: (a, b) => a * b,
};

const testOperators = ({ value: target, ordinals }: Calibration, operators: typeof OPERATORS = OPERATORS): boolean => {
    const digits = ([] as number[]).concat(ordinals);

    const [a, b] = digits.splice(0, 2);
    let totals: Array<number> = Object.values(operators).map<number>(op => op(a, b)).filter(total => total <= target);
    // console.log({ digits, target, a, b, totals });

    let c = digits.shift();
    while (c && totals.length) {
        totals = totals.reduce((acc, cur) => acc.concat(Object.values(operators).map<number>(op => op(cur, c as number))), [] as number[]).filter(total => total <= target);
        // console.log({ c, totals });
        c = digits.shift();
    }

    // console.log({ fn: 'testOperators', some: totals.some(res => res === target) });
    return totals.some(res => res === target);
};

export const getCorrect = (calibrations: Array<Calibration>, operators: typeof OPERATORS = OPERATORS): Array<Calibration> => calibrations.filter(calibration => testOperators(calibration, operators));

type SplitCalibrations = { correct: Array<Calibration>; incorrect: Array<Calibration> };

export const splitCorrect = (calibrations: Array<Calibration>, operators: typeof OPERATORS = OPERATORS): SplitCalibrations => calibrations.reduce<SplitCalibrations>(({ correct, incorrect }, calibration) => {
    if (testOperators(calibration, operators)) {
        return { correct: correct.concat([calibration]), incorrect };
    }
    return { correct, incorrect: incorrect.concat([calibration]) };
}, { correct: [], incorrect: [] });
