import { loadFromFile, predict, priceChanges } from './market';

describe('market utils', () => {
    describe('function loadFromFile', () => {
        it('reads all data', () => {
            const secrets = loadFromFile('./lib/21-24/test/secrets.txt');

            expect(secrets).toHaveLength(4);
            expect(secrets).toEqual([
                1,
                10,
                100,
                2024
            ]);
        });
    });

    describe('function predict', () => {
        it.each`
            secret  | result      | iterations
            ${123}  | ${15887950} | ${1}
            ${123}  | ${16495136} | ${2}
            ${123}  | ${527345}   | ${3}
            ${123}  | ${704524}   | ${4}
            ${123}  | ${1553684}  | ${5}
            ${123}  | ${12683156} | ${6}
            ${123}  | ${11100544} | ${7}
            ${123}  | ${12249484} | ${8}
            ${123}  | ${7753432}  | ${9}
            ${123}  | ${5908254}  | ${10}
            ${1}    | ${8685429}  | ${2000}
            ${10}   | ${4700978}  | ${2000}
            ${100}  | ${15273692} | ${2000}
            ${2024} | ${8667524}  | ${2000}
        `('predicts $result for $secret', ({ secret, result, iterations }) => {
            expect(predict(secret, iterations)).toBe(result);
        });
    });

    describe('function priceChanges', () => {
        describe('iteration testing', () => {
            it('ignores iteration === 1', () => {
                const prices = priceChanges(123, 1);
                expect(prices.size).toBe(0);
            });

            it('ignores iteration === 2', () => {
                const prices = priceChanges(123, 2);
                expect(prices.size).toBe(0);
            });

            it('ignores iteration === 3', () => {
                const prices = priceChanges(123, 3);
                expect(prices.size).toBe(0);
            });

            it('ignores iteration === 4', () => {
                const prices = priceChanges(123, 4);
                expect(prices.size).toBe(0);
            });

            it('records price fluctuations at iteration === 5', () => {
                const prices = priceChanges(123, 5);
                expect(prices.size).toBe(1);
                expect(prices.get('-3,6,-1,-1')).toBe(4);
            });

            it('records price fluctuations at iteration === 6', () => {
                const prices = priceChanges(123, 6);
                expect(prices.size).toBe(2);
                expect(prices.get('-3,6,-1,-1')).toBe(4);
                expect(prices.get('6,-1,-1,0')).toBe(4);
            });

            it('records price fluctuations at iteration === 7', () => {
                const prices = priceChanges(123, 7);
                expect(prices.size).toBe(3);
                expect(prices.get('-3,6,-1,-1')).toBe(4);
                expect(prices.get('6,-1,-1,0')).toBe(4);
                expect(prices.get('-1,-1,0,2')).toBe(6);
            });
        });

        /* eslint-disable no-undefined */
        it.each`
            secret  | result       | iterations | index
            ${123}  | ${6}         | ${10}      | ${'-1,-1,0,2'}
            ${1}    | ${7}         | ${2000}    | ${'-2,1,-1,3'}
            ${2}    | ${7}         | ${2000}    | ${'-2,1,-1,3'}
            ${3}    | ${undefined} | ${2000}    | ${'-2,1,-1,3'}
            ${2024} | ${9}         | ${2000}    | ${'-2,1,-1,3'}
        `('predicts $result for $secret', ({ secret, result, iterations, index }) => {
            const prices = priceChanges(secret, iterations);
            expect(prices.get(index)).toBe(result);
        });
        /* eslint-enable no-undefined */
    });

    describe('best price changes', () => {
        // eslint-disable-next-line max-statements
        it('finds the largest key -2,1-1,3', () => {
            const sequences = [1, 2, 3, 2024].map(p => priceChanges(p, 2000));
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

            expect(largestValue).toBe(23);
            expect(largestKey).toBe('-2,1,-1,3');
        });
    });
});
