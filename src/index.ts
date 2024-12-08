import * as output from './output';

const ENABLED = ['day01', 'day02', 'day03', 'day04', 'day05', 'day07'];

(() => {
    Object.values(output).forEach(fn => ENABLED.includes(fn.name) ? (fn(), console.log('\n')) : console.log(`${fn.name} skipped ...\n`));
})();
