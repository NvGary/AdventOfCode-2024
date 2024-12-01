import fs from 'fs';
import { calcDifference, calcSimilarity, parseLocationId } from './utils/locationId';
import type { LocationId } from './types/location-id';

(() => {
  const left: Array<LocationId> = [];
  const right: Array<LocationId> = [];

  fs.readFileSync('./lib/input.txt', 'utf-8').split(/\r?\n/).forEach(((line: string) => {
    if (line.length> 0) {
      const [l, r] = line.split('   ');
      left.push(parseLocationId(l));
      right.push(parseLocationId(r));
    }
  }));

  console.log(`Location Id difference is: ${calcDifference(left.sort(), right.sort())}`);
  console.log(`Location Id similarity is: ${calcSimilarity(left, right)}`);
})();
