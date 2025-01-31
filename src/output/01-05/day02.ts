import { timings } from '../../utils/test/utils';
import { isSafe, isSafeWithDampener, loadFromFile } from '../../utils/01-05/report';

export const day02 = () => {
    console.log('--- Day 2: Red-Nosed Reports ---');

    const reports = loadFromFile('./lib/01-05/reports.txt');

    timings(() => {
        // 526
        console.log(`Safe report count: ${reports.map(isSafe).filter(res => res).length}`);
    });

    timings(() => {
        // 566
        console.log(`Safe (with dampener) report count: ${reports.map(isSafeWithDampener).filter(res => res).length}`);
    });
};
