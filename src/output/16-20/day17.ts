import { Apu, loadFromFile } from '../../utils/16-20/apu';

const part01 = (registers: number[], bytecode: number[]): void => {
    const apu = new Apu(registers);
    const output = apu.process(bytecode);

    // 4,1,7,6,4,1,0,2,7
    console.log(`Program output is: ${output}`);
};

const part02 = (registers: number[], bytecode: number[]): void => {
    // Const i = bytecode.map((_, k) => 8 ** k);

    // i.forEach((j, n) => {
    //     const apu = new Apu([j].concat(registers.slice(1)));
    //     console.log(j.toString(8));
    //     const output = apu.process(bytecode);
    //     console.log({ n, output });
    // });

    // ^^ every ** gives an extra output digit
    // 8 ** (bytecode.length - 1) should be our starting point

    const LENGTH = bytecode.length - 1;
    const solutions = [[8 ** (LENGTH)]];
    for (let i = 0; i <= LENGTH; ++i) {
        const newSolutions: number[] = [];
        solutions.pop()!.forEach(sol => {
            const attempts = Array(8).fill(0).map((_, idx) => sol + (8 ** (LENGTH - i) * idx));
            // console.log(attempts);

            attempts.forEach(value => {
                const target = bytecode.slice(LENGTH - i).join();
                const apu = new Apu([value].concat(registers.slice(1)));
                const output = apu.process(bytecode).split(',');

                if (output.length) {
                    if (output.slice(LENGTH - i).join() === target) {
                        newSolutions.push(value);
                    }
                }
            });
        });

        // console.log(newSolutions);
        solutions.push(newSolutions);
    }

    // 164279024971453
    console.log(`Lowest positive initial value for register A: ${solutions.pop()!.sort()[0]}`);
};

export const day17 = () => {
    console.log('--- Day 17: Chronospatial Computer ---');

    const { registers, bytecode } = loadFromFile('./lib/16-20/bytecode.txt');

    // 4,1,7,6,4,1,0,2,7
    part01(registers, bytecode);

    // 164279024971453
    part02(registers, bytecode);
};
