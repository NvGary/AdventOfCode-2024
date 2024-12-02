export type LocationId = number;

export const calcDifference = (left: Array<LocationId>, right: Array<LocationId>) => {
  return left.reduce((acc, cur, idx) => {
    return acc += Math.abs(cur - right[idx]);
  }, 0);
}

export const calcSimilarity = (left: Array<LocationId>, right: Array<LocationId>) => {
  return left.reduce((acc, cur) => {
    return acc += cur * right.filter(id => id == cur).length;
  }, 0);
}

export const parseLocationId = (string: string) => parseInt(string);
