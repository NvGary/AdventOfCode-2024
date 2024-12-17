import { Apu, loadFromFile, outputCopy } from '../../utils/16-20/apu';

export const day17 = () => {
    console.log('--- Day 17: Chronospatial Computer ---');

    const { registers, bytecode } = loadFromFile('./lib/16-20/bytecode.txt');

    const apu = new Apu(registers);
    const output = apu.process(bytecode);

    // 4,1,7,6,4,1,0,2,7
    console.log(`Program output is: ${output}`);

    const solutions = outputCopy(registers, bytecode);

    // 164279024971453
    console.log(`Lowest positive initial value for register A: ${solutions.sort()[0]}`);
};
