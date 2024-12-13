import { readFileByLine } from './fs';

type Pebble = number;
type Pebbles = Pebble[];

export const loadFromFile = (filename: string): Pebbles => readFileByLine(filename, line => line.split(' ').map(Number))[0];

type Operator = {
    check: (n: Pebble) => boolean;
    op: (n: Pebble) => Pebble[];
};

const op0: Operator = {
    check: n => n === 0,
    op: n => [n + 1]
};

const opEven: Operator = {
    check: n => n.toString().length % 2 === 0,
    op: n => {
        const c = n.toString();
        const middle = c.length / 2;
        return [Number(c.substring(0, middle)), Number(c.substring(middle))];
    }
};

const opAlways: Operator = {
    check: _ => true,
    op: n => [n * 2024]
};

const OPERATORS = [op0, opEven];

const applyOps = (pebble: Pebble): Pebbles => {
    const { op } = OPERATORS.find(({ check }) => check(pebble)) ?? opAlways;
    return op(pebble);
};

type PebbleCount = Record<number, number>;

const convertToInput = (state: PebbleCount): Pebbles => {
    const res = Object.keys(state).map(n => Number(n));
    // console.log({ fn: 'convertToInput', state, res });

    return res;
};

export const advanceTime = (line: Pebbles, iterations: number = 1): PebbleCount => {
    const time: PebbleCount[] = [line.reduce<PebbleCount>((acc, cur) => {
        acc[cur] = (acc[cur] ?? 0) + 1;
        return { ...acc };
    }, {})];
    for (let i = 0; i < iterations; ++i) {
        const oldState = time.pop()!;
        const newState = convertToInput(oldState).reduce<PebbleCount>((acc, cur) => {
            applyOps(cur).forEach(value => {
                acc[value] = (acc[value] ?? 0) + oldState[cur];
            });
            return { ...acc };
        }, {});
        time.push(newState);
    }

    return time.pop()!;
};

export const sum = (summary: PebbleCount): number => Object.values(summary).reduce((acc, cur) => acc + cur);
