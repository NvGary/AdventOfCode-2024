import { calcDifference, calcSimilarity, loadFromFile } from './utils/locationId';

const day1 = () => {
  console.log('-- DAY 1 --');
  
  const [left, right] = loadFromFile('./lib/location-ids.txt');

  console.log(`Location Id difference is: ${calcDifference(left.sort(), right.sort())}`);
  console.log(`Location Id similarity is: ${calcSimilarity(left, right)}`);
}

const day2 = () => {
  console.log('-- DAY 2 --');

}

(() => {
  day1();
  day2();
})();
