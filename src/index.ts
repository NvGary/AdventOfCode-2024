import { calcDifference, calcSimilarity, loadFromFile as loadLocationIdsFromFile } from './utils/location-id';
import { calculateMuls, loadFromFile as loadMulsFromFile } from './utils/mul';
import { isSafe, isSafeWithDampener, loadFromFile as loadReportsFromFile } from './utils/report';
import { loadFromFile, search } from './utils/word-search';
import { search as searchX } from './utils/x-mas';

const day1 = () => {
  console.log('-- DAY 1 --');
  
  const [left, right] = loadLocationIdsFromFile('./lib/location-ids.txt');

  // 1320851
  console.log(`Location Id difference is: ${calcDifference(left.sort(), right.sort())}`);
  // 26859182
  console.log(`Location Id similarity is: ${calcSimilarity(left, right)}`);
},

 day2 = () => {
  console.log('-- DAY 2 --');

  const reports = loadReportsFromFile('./lib/reports.txt');

  // 526
  console.log(`Safe report count: ${reports.map(isSafe).filter(res => res).length}`);
  // 566
  console.log(`Safe (with dampener) report count: ${reports.map(isSafeWithDampener).filter(res => res).length}`);
},

 day3 = () => {
  console.log('-- DAY 3 --');

  // 191183308
  console.log(`Multiplication results (commands disabled): ${calculateMuls(loadMulsFromFile('./lib/muls.txt', false))}`);
  // 92082041
  console.log(`Multiplication results (commands enabled): ${calculateMuls(loadMulsFromFile('./lib/muls.txt'))}`);
},

 day4 = () => {
  console.log('-- DAY 4 --');

  const grid = loadFromFile('./lib/word-search.txt');
  // 2554
  console.log(`XMAS appears in word search (occurence count): ${search(grid, 'XMAS')}`);
  // 1916
  console.log(`X-MAS appears in word search (occurence count): ${searchX(grid, 'MAS')}`);
}

(() => {
  day1();
  day2();
  day3();
  day4();
})();
