import { readFileByLine } from '../fs';

export type Level = number;
export interface Report {
    levels: Level[];
}

const parseLevel = (string: string) => parseInt(string, 10);

export const loadFromFile = (filename: string): Report[] => readFileByLine<Report>(filename, line => ({ levels: line.split(' ').map(parseLevel) }));

export const isSafe = (report: Report): boolean => {
    const res = report.levels.reduce((acc, cur, idx) => {
        if (idx > 0) {
            let { linear, safe, sign } = acc;
            if (linear && safe) {
                const diff = cur - report.levels[idx - 1];
                sign ??= Math.sign(diff);

                linear = sign !== 0 && sign === Math.sign(diff);
                safe = linear && Math.abs(diff) <= 3;
            }

            return { linear, safe, sign };
        }

        return acc;
    }, { linear: true, safe: true } as { linear: boolean; sign?: number; safe: boolean });

    return res.safe;
};

export const isSafeWithDampener = (report: Report): boolean => {
    let attempted = 0;
    let safe = isSafe(report);

    while (safe === false && attempted < report.levels.length) {
        safe = isSafe({ levels: report.levels.filter((_, idx) => idx !== attempted) });
        attempted += 1;
    }

    return safe;
};
