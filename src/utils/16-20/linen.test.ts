import { determineSolveable, loadFromFile } from './linen';

describe('linen utils', () => {
    describe('function loadFromFile', () => {
        it('loads patterns', () => {
            const towels = loadFromFile('./lib/16-20/test/towels.txt');

            expect(towels).toHaveProperty('patterns', expect.any(Array));

            const { patterns } = towels;
            expect(patterns).toHaveLength(8);
            expect(patterns[0]).toBe('r');
            expect(patterns[1]).toBe('wr');
            expect(patterns.pop()).toBe('br');
        });

        it('loads designs', () => {
            const towels = loadFromFile('./lib/16-20/test/towels.txt');

            expect(towels).toHaveProperty('designs', expect.any(Array));

            const { designs } = towels;
            expect(designs).toHaveLength(8);
            expect(designs[0]).toBe('brwrr');
            expect(designs[1]).toBe('bggr');
            expect(designs.pop()).toBe('bbrgwb');
        });
    });

    describe('function determineSolveable', () => {
        it('solves sample data', () => {
            const towels = loadFromFile('./lib/16-20/test/towels.txt');
            const solveable = determineSolveable(towels);

            expect(solveable).toHaveLength(6);
            expect(solveable[0].design).toBe('brwrr');
            expect(solveable[1].design).toBe('bggr');
            expect(solveable.pop()!.design).toBe('brgr');
        });

        it('returns all possible solutions', () => {
            const towels = loadFromFile('./lib/16-20/test/towels.txt');
            const solveable = determineSolveable(towels);

            expect(solveable.reduce((acc, cur) => acc + cur.solutions, 0)).toBe(16);
            expect(solveable).toHaveLength(6);
            expect(solveable[0].solutions).toBe(2);
            expect(solveable[1].solutions).toBe(1);
            expect(solveable[2].solutions).toBe(4);
            expect(solveable[3].solutions).toBe(6);
            expect(solveable[4].solutions).toBe(1);
            expect(solveable[5].solutions).toBe(2);
        });
    });
});
