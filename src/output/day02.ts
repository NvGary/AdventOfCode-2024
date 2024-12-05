import { isSafe, isSafeWithDampener, loadFromFile } from '../utils/report';

export const day02 = () => {
    console.log('--- Day 2: Red-Nosed Reports ---');
  
    const reports = loadFromFile('./lib/reports.txt');
  
    // 526
    console.log(`Safe report count: ${reports.map(isSafe).filter(res => res).length}`);
    // 566
    console.log(`Safe (with dampener) report count: ${reports.map(isSafeWithDampener).filter(res => res).length}`);
}
