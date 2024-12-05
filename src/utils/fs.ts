import fs from 'fs';

export const readFileByLine = <T extends unknown[]>(file: string, processLine: (line: string) => T): T => {
    const res = [] as unknown as T;

    fs.readFileSync(file, 'utf-8').split(/\r?\n/u).forEach(((line: string) => {
        if (line.length> 0) {
            res.push(...processLine(line));
        }
    }));

    return res;
}
