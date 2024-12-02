import fs from 'fs';

export type LocationId = number;

export const calcDifference = (left: Array<LocationId>, right: Array<LocationId>): number => {
  return left.reduce((acc, cur, idx) => {
    return acc += Math.abs(cur - right[idx]);
  }, 0);
}

export const calcSimilarity = (left: Array<LocationId>, right: Array<LocationId>): number => {
  return left.reduce((acc, cur) => {
    return acc += cur * right.filter(id => id == cur).length;
  }, 0);
}

export const loadFromFile= (file: string): Array<Array<LocationId>> => {
  const left: Array<LocationId> = [];
  const right: Array<LocationId> = [];

  fs.readFileSync(file, 'utf-8').split(/\r?\n/).forEach(((line: string) => {
    if (line.length> 0) {
      const [l, r] = line.split('   ');
      left.push(parseLocationId(l));
      right.push(parseLocationId(r));
    }
  }));

  return [[...left], [...right]];
}

const parseLocationId = (string: string) => parseInt(string);
