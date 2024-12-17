import { readFileByLineBatch } from '../fs';

const enum OpCode {
    ADV,
    BXL,
    BST,
    JNZ,
    BXC,
    OUT,
    BDV,
    CDV
}

const NO_JUMP = -1;

type APUData = {
    registers: number[];
    bytecode: number[];
};

type OpResult = {
    output: number[];
    jump: number;
};

type FnCombo = () => number;

// eslint-disable-next-line no-use-before-define
type Operand = (this: Apu, combo: number) => OpResult;

export class Apu {
    private registers: APUData['registers'];
    private OPERATORS: Record<OpCode, Operand> = {
        [OpCode.ADV]: this.opADV,
        [OpCode.BXL]: this.opBXL,
        [OpCode.BST]: this.opBST,
        [OpCode.JNZ]: this.opJNZ,
        [OpCode.BXC]: this.opBXC,
        [OpCode.OUT]: this.opOUT,
        [OpCode.BDV]: this.opBDV,
        [OpCode.CDV]: this.opCDV,
    };

    constructor(registers: APUData['registers']) {
        this.registers = registers.map(r => r);
    }

    public process(instructions: APUData['bytecode']): string {
        const res = [];
        let pointer = 0;
        while (pointer < instructions.length) {
            const [op, combo] = instructions.slice(pointer, pointer + 2);
            const { output, jump } = this.OPERATORS[op as OpCode].bind(this)(combo);
            if (jump === NO_JUMP) {
                pointer += 2;
            }
            else {
                pointer = jump;
            }

            res.push(...output);
        }

        return res.join(',');
    }

    // eslint-disable-next-line max-statements
    public processClone(instructions: APUData['bytecode']): string {
        const res = [];
        let pointer = 0;
        while (pointer < instructions.length) {
            const [op, combo] = instructions.slice(pointer, pointer + 2);
            const { output, jump } = this.OPERATORS[op as OpCode].bind(this)(combo);
            if (jump === NO_JUMP) {
                pointer += 2;
            }
            else {
                pointer = jump;
            }

            if (output.length) {
                res.push(...output);

                if (res.length > instructions.length) {
                    // Abort
                    return '';
                }

                if (res.slice(0, res.length).join('') !== instructions.slice(0, res.length).join('')) {
                    // Abort
                    // console.log({ res: res.slice(0, res.length).join(''), inst: instructions.slice(0, res.length).join('') });
                    return '';
                }
            }
        }

        return res.join(',');
    }

    private operand(bytecode: number): FnCombo {
        switch (bytecode) {
            case 4:
            case 5:
            case 6:
                return () => this.registers[bytecode % 4];
                break;
            case 7:
                throw new Error('Combo operand 7 is reserved and will not appear in valid programs');
                break;
            default:
                // 0 ... 3
                return () => bytecode;
                break;
        }
    }

    public peekRegisters(): APUData['registers'] {
        return this.registers.map(r => r);
    }

    private opADV(this: Apu, combo: number): OpResult {
        const [numerator] = this.registers;
        const denominator = 2 ** this.operand(combo)();

        this.registers[0] = Math.floor(numerator / denominator);
        return { output: [], jump: NO_JUMP };
    };

    private opBXL(literal: number): OpResult {
        const [, xor] = this.registers;
        // eslint-disable-next-line no-bitwise
        this.registers[1] = Number(BigInt(xor) ^ BigInt(literal));
        return { output: [], jump: NO_JUMP };
    };

    private opBST(combo: number): OpResult {
        const value = this.operand(combo)();
        let mod = value % 8;
        if (mod < 0) {
            mod += 8;
        }
        this.registers[1] = mod;

        return { output: [], jump: NO_JUMP };
    };

    private opJNZ(literal: number): OpResult {
        let jump = NO_JUMP;
        const [guard] = this.registers;
        if (guard > 0) {
            jump = literal;
        }

        return { output: [], jump };
    };

    private opBXC(_: number): OpResult {
        const [, xorX, xorY] = this.registers;
        // eslint-disable-next-line no-bitwise
        this.registers[1] = Number(BigInt(xorX) ^ BigInt(xorY));
        return { output: [], jump: NO_JUMP };
    };

    private opOUT(combo: number): OpResult {
        const value = this.operand(combo)();

        let mod = value % 8;
        if (mod < 0) {
            mod += 8;
        }
        return { output: [mod], jump: NO_JUMP };
    };

    private opBDV(combo: number): OpResult {
        const [numerator] = this.registers;
        const denominator = 2 ** this.operand(combo)();

        this.registers[1] = Math.floor(numerator / denominator);
        return { output: [], jump: NO_JUMP };
    };

    private opCDV(combo: number): OpResult {
        const [numerator] = this.registers;
        const denominator = 2 ** this.operand(combo)();

        this.registers[2] = Math.floor(numerator / denominator);
        return { output: [], jump: NO_JUMP };
    };
}

export const loadFromFile = (filename: string): APUData => readFileByLineBatch<APUData>(filename, ([registerA, registerB, registerC, bytecode]: string[]) => ({
    registers: [registerA, registerB, registerC].map(reg => Number(reg.match(/[-]{0,1}\d+/gu)![0])),
    bytecode: bytecode.match(/[-]{0,1}\d+/gu)!.map(b => Number(b))
}), 5)[0];
