import { FREE_BLOCK, FreeBlocks } from './freeBlocks';
import type { DiskMap } from './diskmap.types';

// Const toString = (disk: DiskMap): string => disk.map<string>(block => `${block.fileId ?? '.'}`).join('');

// eslint-disable-next-line max-statements
const lastAllocatedBlock = (disk: DiskMap, start: number): { index: number; length: number } => {
    // console.log({ fn: 'lastAllocatedBlock', start });

    let index = start;
    let length = 0;
    while (index > 0 && disk[index] === FREE_BLOCK) {
        // console.log('FREE_BLOCK');
        --index;
    }

    if (index) {
        const block = disk[index];
        while (index > 0 && disk[index].fileId === block.fileId) {
            --index;
            ++length;
        }

        // console.log({ fn: 'lastAllocatedBlock', index: index + 1, length, block });
        return { index: index + 1, length };
    }

    return { index: 0, length: 0 };
};

// Const freeBlock = (disk: DiskMap, length: number): number => {
//     let freePos = disk.indexOf(FREE_BLOCK);

//     while (freePos !== -1 && freePos + length < disk.length) {
//         const allocatedPos = disk.findIndex((block, idx) => block !== FREE_BLOCK && idx > freePos);
//         if (allocatedPos - freePos >= length) {
//             return freePos;
//         }

//         freePos = disk.indexOf(FREE_BLOCK, freePos + 1);
//     }

//     return -1;
// };

// eslint-disable-next-line max-statements
export const defragment = (disk: DiskMap): DiskMap => {
    const freeBlocks = new FreeBlocks();
    freeBlocks.build(disk);

    const final: DiskMap = disk.map(block => block);
    let { index: readPos, length: blockLength } = lastAllocatedBlock(disk, disk.length - 1);
    let writePos = freeBlocks.release(blockLength);
    let lastMovedFileId: number = disk[readPos].fileId! + 1;
    // console.log({ fn: 'defragment:01', blockLength, lastMovedFileId, readPos, writePos });

    while (lastMovedFileId > 0) {
        lastMovedFileId = final[readPos].fileId!;
        // console.log({ fn: 'defragment:02', blockLength, lastMovedFileId, readPos, writePos });

        if (writePos >= 0 && readPos && writePos < readPos) {
            // Relocate block
            // console.log({ fn: 'defragment', msg: 'relocating block' });
            final.fill(final[readPos], writePos, writePos + blockLength);
            final.fill(FREE_BLOCK, readPos, readPos + blockLength);
        }

        ({ index: readPos, length: blockLength } = lastAllocatedBlock(final, readPos - 1));
        // If (lastMovedFileId === 1) return final;
        while (readPos > 0 && final[readPos].fileId! > lastMovedFileId) {
            ({ index: readPos, length: blockLength } = lastAllocatedBlock(final, readPos - 1,));
            // console.log({ fn: 'defragment:03', blockLength, lastMovedFileId, readPos, writePos });
        }

        if (readPos > 0) {
            writePos = freeBlocks.release(blockLength);
        }
    }

    // console.log(toString(final));
    return final;
};
