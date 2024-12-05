import * as output from './output';

(() => {
  Object.values(output).forEach((fn) => (fn(), console.log('\n')));
})();
