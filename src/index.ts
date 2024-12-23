import * as output from './output';

const DISABLED = ['day06', 'day07', 'day09', 'day11', 'day14', 'day20', 'day21'];

(() => {
    Object.values(output).forEach(fn => DISABLED.includes(fn.name) ? console.log(`${fn.name} skipped ... needs optimised ;)\n`) : (fn(), console.log('\n')));
})();
