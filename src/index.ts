import { calcDifference, calcSimilarity, loadFromFile as loadLocationIdsFromFile } from './utils/locationId';
import { isSafe, isSafeWithDampener, loadFromFile as loadReportsFromFile } from './utils/report';

const day1 = () => {
  console.log('-- DAY 1 --');
  
  const [left, right] = loadLocationIdsFromFile('./lib/location-ids.txt');

  console.log(`Location Id difference is: ${calcDifference(left.sort(), right.sort())}`);
  console.log(`Location Id similarity is: ${calcSimilarity(left, right)}`);
}

const day2 = () => {
  console.log('-- DAY 2 --');

  const reports = loadReportsFromFile('./lib/reports.txt');

  console.log(`Safe report count: ${reports.map(isSafe).filter(res => res === true).length}`);
  console.log(`Safe (with dampener) report count: ${reports.map(isSafeWithDampener).filter(res => res === true).length}`);
}

(() => {
  day1();
  day2();
})();
