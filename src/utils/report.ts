import fs from 'fs';

export type Level = number;
export type Report = {
    levels: Array<Level>
};

export const loadFromFile = (file: string): Array<Report> => {
    const data: Array<Report> = [];

    fs.readFileSync(file, 'utf-8').split(/\r?\n/).forEach(((line: string) => {
      if (line.length> 0) {
        data.push({ levels: line.split(' ').map(parseLevel) });
      }
    }));

    return data;
}

export const isSafe = (report: Report): boolean => {
    const res = report.levels.reduce((acc, cur, idx) => {
        if (idx > 0) {
            let { linear, safe, sign } = acc;
            if (linear && safe) {
                const diff = cur - report.levels[idx - 1];
                sign ??= Math.sign(diff)

                linear = sign !== 0 && sign === Math.sign(diff);
                safe = linear && Math.abs(diff) <= 3;
            }

            return { linear, safe, sign };
        }

        return acc;
    }, { linear: true, safe: true } as { linear: boolean, sign?: number, safe: boolean });

    return res.safe;
}

export const isSafeWithDampener = (report: Report): boolean => {
    let safe = isSafe(report);
    let attempted = 0;

    while (safe === false && attempted < report.levels.length) {
        safe = isSafe({ levels: report.levels.filter((_, idx) => idx !== attempted) });
        attempted += 1;
    }

    return safe;
}

const parseLevel = (string: string) => parseInt(string);
