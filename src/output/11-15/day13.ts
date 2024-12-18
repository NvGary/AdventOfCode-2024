import { timings } from '../../utils/test/utils';
import { cost, loadFromFile } from '../../utils/11-15/claw-machine';
import { loadFromFile as loadFromFileX } from '../../utils/11-15/claw-machine-x';

export const day13 = () => {
    console.log('--- Day 13: Claw Contraption ---');

    timings(() => {
        const machines = loadFromFile('./lib/11-15/arcade.txt');

        // 36870
        console.log(`Minimum cost is: ${machines.reduce((acc, cur) => acc + cost(cur), 0)}`);
    });

    timings(() => {
        const machinesX = loadFromFileX('./lib/11-15/arcade.txt');

        // 78101482023732
        console.log(`Minimum X cost is: ${machinesX.reduce((acc, cur) => acc + cost(cur), 0)}`);
    });
};
