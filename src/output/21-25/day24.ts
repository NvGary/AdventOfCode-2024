import { applyInstructions, loadFromFile, readAll, setAll, traverse } from '../../utils/21-25/binary';
import { timings } from '../../utils/test/utils';

export const day24 = () => {
    console.log('--- Day 24: Crossed Wires ---');

    // timings(() => {
    //     const system = loadFromFile('./lib/21-25/gates.txt');
    //     const registers = applyInstructions(system);

    //     // 55730288838374
    //     console.log(`Decimal number output on the wires starting with z: ${readAll(registers, 'z')}`);
    // });

    // eslint-disable-next-line max-statements
    timings(() => {
        const incorrect = [];
        for (let i = 0; i < 45; ++i) {
            const system = loadFromFile('./lib/21-25/gates.txt');
            let registers = setAll(system.registers, 'x', 0);
            registers = setAll(registers, 'y', 0);

            const numeral = i.toString().padStart(2, '0');
            registers.set(`x${numeral}`, 1);
            registers.set(`y${numeral}`, 1);

            registers = applyInstructions({ registers, instructions: system.instructions });

            if (registers.get(`z${(i + 1).toString().padStart(2, '0')}`) !== 1) {
                incorrect.push(i);
            }

            const inst = traverse(system.instructions, `z${numeral}`);
            // if (inst.length !== 8) {
                console.log(i, inst);
            // }
            // console.log('--- ' + i + ' ---');
            // console.log(readAll(registers, 'z'));
        }

        console.log(incorrect);
    });
};
