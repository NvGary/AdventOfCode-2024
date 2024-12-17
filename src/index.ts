import * as output from './output';

const ENABLED = ['day01', 'day02', 'day03', 'day04', 'day05', 'day08', 'day10', 'day12', 'day13', 'day15', 'day17'];

(() => {
    Object.values(output).forEach(fn => ENABLED.includes(fn.name) ? (fn(), console.log('\n')) : console.log(`${fn.name} skipped ...\n`));
})();
