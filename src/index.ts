import { calcDifference, calcSimilarity, loadFromFile as loadLocationIdsFromFile } from './utils/locationId';
import { calculateMuls, loadFromFile } from './utils/mul';
import { isSafe, isSafeWithDampener, loadFromFile as loadReportsFromFile } from './utils/report';

const day1 = () => {
  console.log('-- DAY 1 --');
  
  const [left, right] = loadLocationIdsFromFile('./lib/location-ids.txt');

  // 1320851
  console.log(`Location Id difference is: ${calcDifference(left.sort(), right.sort())}`);
  // 26859182
  console.log(`Location Id similarity is: ${calcSimilarity(left, right)}`);
}

const day2 = () => {
  console.log('-- DAY 2 --');

  const reports = loadReportsFromFile('./lib/reports.txt');

  // 526
  console.log(`Safe report count: ${reports.map(isSafe).filter(res => res).length}`);
  // 566
  console.log(`Safe (with dampener) report count: ${reports.map(isSafeWithDampener).filter(res => res).length}`);
}

const day3 = () => {
  console.log('-- DAY 3 --');

  // 191183308
  console.log(`Multiplication results (commands disabled): ${calculateMuls(loadFromFile('./lib/muls.txt', false))}`);
  // 92082041
  console.log(`Multiplication results (commands enabled): ${calculateMuls(loadFromFile('./lib/muls.txt'))}`);
}

(() => {
  day1();
  day2();
  day3();
})();
