import { complexity, fromDirectional, fromNumerical, loadFromFile } from './keypad';

describe('keypad utils', () => {
    describe('function loadFromFile', () => {
        it('reads all available keycodes', () => {
            const codes = loadFromFile('./lib/21-24/test/codes.txt');

            expect(codes).toHaveLength(5);
            expect(codes[0]).toBe('029A');
            expect(codes.pop()).toBe('379A');
        });
    });

    describe('function fromNumerical', () => {
        it('converts numerical to directional keypresses', () => {
            const keys = fromNumerical('029A');

            expect(keys).toHaveLength(12);
            expect(keys.startsWith('<A^A')).toBe(true);
            expect(keys.endsWith('AvvvA')).toBe(true);
        });
    });

    describe('function fromDirectional', () => {
        it.each`
            input | res
            ${'<A^A>^^AvvvA'} | ${28}
            ${'v<<A>>^A<A>AvA<^AA>A<vAAA>^A'} | ${68}
        `('converts $input to directional keypresses', ({ input, res }) => {
            const keys = fromDirectional(input);

            expect(keys).toHaveLength(res);
        });
    });

    describe('function complexity', () => {
        it.each`
            code | res
            ${'029A'} | ${68 * 29}
            ${'980A'} | ${60 * 980}
            ${'179A'} | ${68 * 179}
            ${'456A'} | ${64 * 456}
            ${'379A'} | ${64 * 379}
        `('calculates complexity for $code', ({ code, res }) => {
            expect(complexity(code)).toBe(res);
        });
    });
});
