import { readFileByLine } from '../fs';

type Instruction = {
    inputs: string[];
    op: string;
    output: string;
};

type BinarySystem = {
    registers: Map<string, number>;
    instructions: Instruction[];
};

export const loadFromFile = (filename: string): BinarySystem => {
    const registers = new Map<string, number>();
    const instructions: Instruction[] = [];

    readFileByLine(filename, line => {
        if (line.includes(':')) {
            const [name, value] = line.split(': ');
            registers.set(name, Number(value));
        }

        if (line.includes('->')) {
            const [regA, op, regB, , output] = line.split(' ');
            instructions.push({
                inputs: [regA, regB],
                op,
                output
            });
        }
    });

    return { registers, instructions };
};

const OP: Record<string, (a: number, b: number) => number> = {
    AND: (a: number, b: number): number => a & b,
    OR: (a: number, b: number): number => a | b,
    XOR: (a: number, b: number): number => a ^ b,
};

export const applyInstructions = ({ registers, instructions }: BinarySystem): BinarySystem['registers'] => {
    const delayed: BinarySystem['instructions'] = [];

    instructions.forEach(instruction => {
        const { inputs: [regA, regB], op, output } = instruction;

        if (typeof registers.get(regA) === 'undefined' || typeof registers.get(regB) === 'undefined') {
            delayed.push(instruction);
        }
        else {
            // if (output.startsWith('z')) {
            //     console.log({ instruction }, { inputs: [registers.get(regA), registers.get(regB)] });
            // }
            registers.set(output, OP[op](registers.get(regA)!, registers.get(regB)!));
        }
    });

    if (delayed.length) {
        return applyInstructions({ registers, instructions: delayed });
    }

    return registers;
};

export const readAll = (registers: BinarySystem['registers'], indexor: string): number => {
    const num = Array.from(registers.keys()).filter(reg => reg.startsWith(indexor)).length;

    const regValues = Array(num).fill(0);
    const link = registers[Symbol.iterator]();

    for (const [key, value] of link) {
        if (key.startsWith(indexor)) {
            regValues[Number(key.slice(1))] = value;
        }
    }

    console.log(regValues);
    return parseInt(regValues.reverse().join(''), 2);
};

export const setAll = (registers: BinarySystem['registers'], indexor: string, value: number): BinarySystem['registers'] => {
    const keys = registers.keys()[Symbol.iterator]();

    for (const key of keys) {
        if (key.startsWith(indexor)) {
            registers.set(key, value);
        }
    }

    return registers;
};

export const traverse = (instructions: BinarySystem['instructions'], registerName: string): Instruction[] => {
    const res: Instruction[] = [];
    instructions.forEach(instruction => {
        const { inputs: [regA, regB], output } = instruction;
        if ([regA, regB, output].includes(registerName)) {
            res.push(instruction);
        }
    });

    res.forEach(inst => {
        inst.inputs.concat(inst.output).forEach(name => {
            instructions.forEach(instruction => {
                const { inputs: [regA, regB], output } = instruction;
                if ([regA, regB, output].includes(name)) {
                    res.push(instruction);
                }
            });
        });
    });

    res.forEach(inst => {
        inst.inputs.concat(inst.output).forEach(name => {
            instructions.forEach(instruction => {
                const { inputs: [regA, regB], output } = instruction;
                if ([regA, regB, output].includes(name)) {
                    res.push(instruction);
                }
            });
        });
    });

    res.forEach(inst => {
        inst.inputs.concat(inst.output).forEach(name => {
            instructions.forEach(instruction => {
                const { inputs: [regA, regB], output } = instruction;
                if ([regA, regB, output].includes(name)) {
                    res.push(instruction);
                }
            });
        });
    });

    return Array.from(new Set(res));
};
