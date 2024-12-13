import fs from 'fs';

type Callback<T> = (line: string) => T;

/**
 * Processes the supplied  {@link filename} in batches, invoking {@link processLine} for every line read.
 * Blank lines are not sent to {@link processLine}.
 *
 * @param {string} filename Name of the file to process. Path is relative to cwd
 * @param {Callback} processLine Callback to invoke for every line read
 * @returns {T} Array of {@link T}
 */
export const readFileByLine = <T extends unknown[]>(filename: string, processLine: Callback<T>): T => {
    const res = [] as unknown as T;

    fs.readFileSync(filename, 'utf-8').split(/\r?\n/u).forEach((line: string) => {
        if (line.length > 0) {
            res.push(...processLine(line));
        }
    });

    return res;
};

type BatchCallback<T> = (lines: string[]) => T;

/**
 * Processes the supplied  {@link filename} in batches, invoking {@link processBatch} once for every {@link batchSize} lines read
 * Blank lines are not sent to {@link processBatch}.
 *
 * @param {string} filename Name of the file to process. Path is relative to cwd
 * @param {BatchCallback} processBatch Callback to invoke for every batch read
 * @param {number} batchSize Size of the batch. After reading this many lines, invoke {@link processBatch}
 * @returns {T} Array of {@link T}
 */
export const readFileByLineBatch = <T>(filename: string, processBatch: BatchCallback<T>, batchSize: number): T[] => {
    const res: T[] = [];
    if (batchSize <= 0) {
        // Aborting due to invalid batch size
        return res;
    }

    let linesRead = 0;
    const lines: string[] = [];

    fs.readFileSync(filename, 'utf-8').split(/\r?\n/u).forEach((line: string) => {
        if (line.length > 0) {
            lines.push(line);
        }

        if (++linesRead === batchSize) {
            res.push(processBatch(lines.splice(0, lines.length)));
            linesRead = 0;
        };
    });

    // Clean up any remaining lines
    if (linesRead) {
        res.push(processBatch(lines.splice(0, lines.length)));
    }

    return res;
};
