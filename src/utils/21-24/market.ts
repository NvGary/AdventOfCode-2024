import { readFileByLine } from '../fs';
import { modulo } from '../math';

type Secret = number;
type Secrets = Secret[];

export const loadFromFile = (filename: string): Secrets => readFileByLine(filename, line => Number(line));

// eslint-disable-next-line no-bitwise
const opMix = (a: bigint, b: bigint): bigint => BigInt(a) ^ BigInt(b);
const opPrune = (a: bigint): number => Number(modulo(a, BigInt(16777216)));
const opMul = (a: number, b: number): bigint => BigInt(a) * BigInt(b);
const opDiv = (a: number, b: number): number => Math.floor(a / b);

const advanceSecret = (secret: Secret): Secret => {
    const step1: number = opPrune(opMix(opMul(secret, 64), BigInt(secret)));
    const step2 = opPrune(opMix(BigInt(opDiv(step1, 32)), BigInt(step1)));
    const step3 = opPrune(opMix(opMul(step2, 2048), BigInt(step2)));

    // console.log({ secret, step1, step2, step3 })
    return step3;
};

export const predict = (secret: Secret, iterations: number = 1): Secret => {
    let res = secret;
    for (let i = 0; i < iterations; ++i) {
        res = advanceSecret(res);
    }

    return res;
};

// eslint-disable-next-line max-statements
export const priceChanges = (secret: Secret, iterations: number = 1): Map<string, number> => {
    let seed = secret;
    let prevPrice = Number(modulo(BigInt(seed), BigInt(10)));
    const prices: number[] = [prevPrice];
    const fluctuations: number[] = [];

    const iter = () => {
        seed = advanceSecret(seed);
        const price = Number(modulo(BigInt(seed), BigInt(10)));
        prices.push(price);

        fluctuations.push(price - prevPrice);
        prevPrice = price;
    };

    iter();
    iter();
    iter();

    const priceSequences = new Map<string, number>();

    for (let i = 5; i <= iterations; ++i) {
        iter();

        const flucSeq = fluctuations.slice(-4);
        const key = flucSeq.join(',');
        if (priceSequences.has(key) === false) {
            priceSequences.set(key, prevPrice);
        }
    }

    return priceSequences;
};
