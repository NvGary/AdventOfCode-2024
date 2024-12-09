import type { Block, DiskMap } from './diskmap.types';
import { FREE_BLOCK } from './freeBlocks';
import { readFileByLine } from './fs';

// Const toString = (disk: DiskMap): string => disk.map<string>(block => `${block.fileId ?? '.'}`).join('');

const decompress = (string: string): DiskMap => {
    const disk: DiskMap = [];
    let freeSpace = false;
    let blockId = 0;

    Array.from(string).forEach(c => {
        const size = Number(c);
        if (size > 0) {
            const block = freeSpace ? FREE_BLOCK : { fileId: blockId };
            disk.push(...new Array<Block>(Number(c)).fill(block));
        }
        if (!freeSpace) {
            ++blockId;
        }
        freeSpace = !freeSpace;
    });

    // console.log(toString(disk));
    return disk;
};

export const loadFromFile = (filename: string): DiskMap => readFileByLine(filename, line => decompress(line));

const lastAllocatedBlock = (disk: DiskMap, start: number): number => {
    let index = start;
    while (index > 0 && disk[index] === FREE_BLOCK) {
        --index;
    }

    return index;
};

// eslint-disable-next-line max-statements
export const defragment = (disk: DiskMap): DiskMap => {
    let freePos = disk.indexOf(FREE_BLOCK);
    let writePos = freePos;
    let readPos = lastAllocatedBlock(disk, disk.length - 1);

    const final: DiskMap = disk.map(block => block);
    while (readPos > writePos) {
        final[writePos] = final[readPos];
        final[readPos] = FREE_BLOCK;

        freePos = final.indexOf(FREE_BLOCK, freePos);
        writePos = freePos;
        readPos = lastAllocatedBlock(final, readPos - 1,);
    }

    // console.log(toString(final));
    return final;
};

export const checksum = (disk: DiskMap): number => disk.reduce<number>((acc, cur, idx) => {
    if (cur === FREE_BLOCK) {
        return acc;
    }

    return acc + (cur.fileId! * idx);
}, 0);
