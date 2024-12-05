import fs from 'fs';

export type LocationId = number;

const parseLocationId = (string: string) => parseInt(string, 10);

export const loadFromFile= (file: string): LocationId[][] => {
  const left: LocationId[] = [],
   right: LocationId[] = [];

  fs.readFileSync(file, 'utf-8').split(/\r?\n/u).forEach(((line: string) => {
    if (line.length> 0) {
      const [l, r] = line.split('   ');
      left.push(parseLocationId(l));
      right.push(parseLocationId(r));
    }
  }));

  return [[...left], [...right]];
}

export const calcDifference = (left: LocationId[], right: LocationId[]): number => left.reduce((acc, cur, idx) => acc + Math.abs(cur - right[idx]), 0)

export const calcSimilarity = (left: LocationId[], right: LocationId[]): number => left.reduce((acc, cur) => acc + cur * right.filter(id => id === cur).length, 0)
