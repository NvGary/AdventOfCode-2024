import { applyInstructions, loadFromFile, readAll } from './binary';

describe('binary utils', () => {
    describe('function laodFromFile', () => {
        it('loads all data', () => {
            const data = loadFromFile('./lib/21-25/test/gates01.txt');

            expect(data).toMatchObject({
                registers: expect.any(Map),
                instructions: expect.any(Array)
            });
        });
    });

    describe('function applyInstructions', () => {
        describe('data set 01', () => {
            it('correctly sets all z registers', () => {
                const system = loadFromFile('./lib/21-25/test/gates01.txt');
                const registers = applyInstructions(system);

                expect(registers.get('z00')).toBe(0);
                expect(registers.get('z01')).toBe(0);
                expect(registers.get('z02')).toBe(1);
            });
        });

        describe('data set 02', () => {
            // eslint-disable-next-line max-statements
            it('correctly sets all z registers', () => {
                const system = loadFromFile('./lib/21-25/test/gates02.txt');
                const registers = applyInstructions(system);
                // console.log(registers);

                expect(registers.get('z00')).toBe(0);
                expect(registers.get('z01')).toBe(0);
                expect(registers.get('z02')).toBe(0);
                expect(registers.get('z03')).toBe(1);
                expect(registers.get('z04')).toBe(0);
                expect(registers.get('z05')).toBe(1);
                expect(registers.get('z06')).toBe(1);
                expect(registers.get('z07')).toBe(1);
                expect(registers.get('z08')).toBe(1);
                expect(registers.get('z09')).toBe(1);
                expect(registers.get('z10')).toBe(1);
                expect(registers.get('z11')).toBe(0);
                expect(registers.get('z12')).toBe(0);
            });
        });
    });

    describe('function readZ', () => {
        describe('data set 01', () => {
            it('calculates as 4', () => {
                const system = loadFromFile('./lib/21-25/test/gates01.txt');
                const registers = applyInstructions(system);
                const res = readAll(registers, 'z');

                expect(res).toBe(4);
            });
        });

        describe('data set 02', () => {
            it('calculates as 2024', () => {
                const system = loadFromFile('./lib/21-25/test/gates02.txt');
                const registers = applyInstructions(system);
                const res = readAll(registers, 'z');

                expect(res).toBe(2024);
            });
        });
    });
});
