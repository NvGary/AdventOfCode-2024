import { cost, loadFromFile } from '../utils/claw-machine';
import { loadFromFile as loadFromFileX } from '../utils/claw-machine-x';

export const day13 = () => {
    console.log('--- Day 13: Claw Contraption ---');

    const machines = loadFromFile('./lib/arcade.txt');

    // 36870
    console.log(`Minimum cost is: ${machines.reduce((acc, cur) => acc + cost(cur), 0)}`);

    const machinesX = loadFromFileX('./lib/arcade.txt');

    // 78101482023732
    console.log(`Minimum X cost is: ${machinesX.reduce((acc, cur) => acc + cost(cur), 0)}`);
};
