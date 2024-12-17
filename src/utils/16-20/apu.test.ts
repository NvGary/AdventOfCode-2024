import { Apu, loadFromFile, outputCopy } from './apu';

const NOT_USED = -1;

describe('apu utils', () => {
    describe('loadFromFile function', () => {
        it('loads apu data correctly', () => {
            const apu = loadFromFile('./lib/16-20/test/bytecode.txt');

            expect(apu).toHaveProperty('registers', expect.arrayContaining([729, 0, 0]));
            expect(apu).toHaveProperty('bytecode', expect.arrayContaining([0, 1, 5, 4, 3, 0]));
        });
    });

    describe('operands', () => {
        describe('opADV', () => {
            it.each`
                instructions | result
                ${[0, 0]} | ${8}
                ${[0, 1]} | ${4}
                ${[0, 2]} | ${2}
                ${[0, 3]} | ${1}
            `('sets register A to correct value of $result', ({ instructions, result }) => {
                const apu = new Apu([8, 0, 0]);
                apu.process(instructions);

                expect(apu.peekRegisters()).toEqual([result, 0, 0]);
            });
        });

        describe('opBXL', () => {
            it.each`
                instructions | registerB | result
                ${[1, 0]} | ${0} | ${0}
                ${[1, 1]} | ${0} | ${1}
                ${[1, 0]} | ${1} | ${1}
                ${[1, 1]} | ${1} | ${0}
                ${[1, 3]} | ${5} | ${6}
            `('sets register B to correct value of $result', ({ instructions, registerB, result }) => {
                const apu = new Apu([0, registerB, 0]);
                apu.process(instructions);

                expect(apu.peekRegisters()).toEqual([0, result, 0]);
            });
        });

        describe('opBST', () => {
            it.each`
                instructions | result
                ${[2, 0]} | ${0}
                ${[2, 1]} | ${1}
                ${[2, 2]} | ${2}
                ${[2, 3]} | ${3}
                ${[2, 4]} | ${4}
                ${[2, 5]} | ${5}
                ${[2, 6]} | ${1}
            `('sets register B to correct value of $result', ({ instructions, result }) => {
                const apu = new Apu([12, 13, 9]);
                apu.process(instructions);

                expect(apu.peekRegisters()).toEqual([12, result, 9]);
            });
        });

        describe('opJNZ', () => {
            it.each`
                instructions | registers | result
                ${[3, 6, 2, 6]} | ${[0, 0, 9]} | ${[0, 1, 9]}
                ${[3, 4, 7, 7, 1, 3]} | ${[4, 5, 0]} | ${[4, 6, 0]}
            `('sets register B to correct value of $result', ({ instructions, registers, result }) => {
                const apu = new Apu(registers);
                apu.process(instructions);

                expect(apu.peekRegisters()).toEqual(result);
            });
        });

        describe('opBXC', () => {
            it.each`
                instructions | registers | result
                ${[4, NOT_USED]} | ${[0, 0, 0]} | ${[0, 0, 0]}
                ${[4, NOT_USED]} | ${[0, 0, 1]} | ${[0, 1, 1]}
                ${[4, NOT_USED]} | ${[0, 1, 0]} | ${[0, 1, 0]}
                ${[4, NOT_USED]} | ${[0, 1, 1]} | ${[0, 0, 1]}
                ${[4, NOT_USED]} | ${[0, 5, 3]} | ${[0, 6, 3]}
            `('sets register B to correct value of $result', ({ instructions, registers, result }) => {
                const apu = new Apu(registers);
                apu.process(instructions);
                expect(apu.peekRegisters()).toEqual(result);
            });
        });

        describe('opOUT', () => {
            it.each`
                instructions | result
                ${[5, 0]} | ${0}
                ${[5, 1]} | ${1}
                ${[5, 2]} | ${2}
                ${[5, 3]} | ${3}
                ${[5, 4]} | ${4}
                ${[5, 5]} | ${5}
                ${[5, 6]} | ${1}
            `('sets register B to correct value of $result', ({ instructions, result }) => {
                const apu = new Apu([12, 13, 9]);
                const output = apu.process(instructions);

                expect(apu.peekRegisters()).toEqual([12, 13, 9]);
                expect(output).toEqual(`${result}`);
            });
        });

        describe('opBDV', () => {
            it.each`
                instructions | result
                ${[6, 0]} | ${8}
                ${[6, 1]} | ${4}
                ${[6, 2]} | ${2}
                ${[6, 3]} | ${1}
            `('sets register A to correct value of $result', ({ instructions, result }) => {
                const apu = new Apu([8, 0, 0]);
                apu.process(instructions);

                expect(apu.peekRegisters()).toEqual([8, result, 0]);
            });
        });

        describe('opCDV', () => {
            it.each`
                instructions | result
                ${[7, 0]} | ${8}
                ${[7, 1]} | ${4}
                ${[7, 2]} | ${2}
                ${[7, 3]} | ${1}
            `('sets register A to correct value of $result', ({ instructions, result }) => {
                const apu = new Apu([8, 0, 0]);
                apu.process(instructions);

                expect(apu.peekRegisters()).toEqual([8, 0, result]);
            });
        });
    });

    describe('function process', () => {
        describe('sample data', () => {
            it('processes bytecode 2,6', () => {
                const apu = new Apu([0, 0, 9]);
                apu.process([2, 6]);

                const registers = apu.peekRegisters();
                expect(registers[1]).toBe(1);
            });

            it('processes bytecode 5,0,5,1,5,4', () => {
                const apu = new Apu([10, 0, 0]);
                const output = apu.process([5, 0, 5, 1, 5, 4]);

                expect(output).toBe('0,1,2');
            });

            it('processes bytecode 0,1,5,4,3,0', () => {
                const apu = new Apu([2024, 0, 0]);
                const output = apu.process([0, 1, 5, 4, 3, 0]);

                expect(output).toBe('4,2,5,6,7,7,7,7,3,1,0');

                const registers = apu.peekRegisters();
                expect(registers[0]).toBe(0);
            });

            it('processes bytecode 1,7', () => {
                const apu = new Apu([0, 29, 0]);
                apu.process([1, 7]);

                const registers = apu.peekRegisters();
                expect(registers[1]).toBe(26);
            });

            it('processes bytecode 4,07', () => {
                const apu = new Apu([0, 2024, 43690]);
                apu.process([4, 0]);

                const registers = apu.peekRegisters();
                expect(registers[1]).toBe(44354);
            });
        });

        it('processes per expectations', () => {
            const { registers, bytecode } = loadFromFile('./lib/16-20/test/bytecode.txt');
            const apu = new Apu(registers);
            const output = apu.process(bytecode);

            expect(output).toBe('4,6,3,5,6,3,5,2,1,0');
        });
    });

    describe('function outputCopy', () => {
        it('determines the correct value for register A', () => {
            const solutions = outputCopy([0, 0, 0], [0, 3, 5, 4, 3, 0]);

            expect(solutions.sort()[0]).toBe(117440);
        });
    });
});
