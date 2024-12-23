import { loadFromFile, predict, priceChanges } from '../../utils/21-25/market';
import { timings } from '../../utils/test/utils';

export const day22 = () => {
    console.log('--- Day 22: Monkey Market ---');

    const secrets = loadFromFile('./lib/21-25/secrets.txt');

    timings(() => {
        const predictions = secrets.map(secret => predict(secret, 2000));

        // 21147129593
        console.log(`Total predictions are: ${predictions.reduce((acc, cur) => acc + cur)}`);
    });

    timings(() => {
        const sequences = secrets.map(p => priceChanges(p, 2000));
        const combined = sequences.reduce((acc, cur) => {
            const iter = cur[Symbol.iterator]();

            for (const [key, value] of iter) {
                acc.set(key, value + (acc.get(key) ?? 0));
            }

            return acc;
        });

        let largestValue = 0;
        let largestKey = '';
        const iter = combined[Symbol.iterator]();

        for (const [key, value] of iter) {
            if (value > largestValue) {
                largestValue = value;
                largestKey = key;
            }
        }

        // 2445
        console.log(`Sequence (${largestKey}) yields the most bananas: ${largestValue}`);
    });
};
