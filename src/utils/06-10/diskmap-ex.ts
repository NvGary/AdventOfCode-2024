import type { DiskMap } from './diskmap.types';
import { FREE_BLOCK, FreeBlocks } from './freeBlocks';

// eslint-disable-next-line max-statements
const lastAllocatedBlock = (disk: DiskMap, start: number): { index: number; length: number } => {
    let index = start;
    let length = 0;
    while (index > 0 && disk[index] === FREE_BLOCK) {
        --index;
    }

    if (index) {
        const block = disk[index];
        while (index > 0 && disk[index].fileId === block.fileId) {
            --index;
            ++length;
        }

        return { index: index + 1, length };
    }

    return { index: 0, length: 0 };
};

// eslint-disable-next-line max-statements
export const defragment = (disk: DiskMap): DiskMap => {
    const freeBlocks = new FreeBlocks();
    freeBlocks.build(disk);

    const final: DiskMap = disk.map(block => block);
    let { index: readPos, length: blockLength } = lastAllocatedBlock(disk, disk.length - 1);
    let writePos = freeBlocks.release(blockLength);
    let lastMovedFileId: number = disk[readPos].fileId! + 1;

    while (lastMovedFileId > 0) {
        lastMovedFileId = final[readPos].fileId!;

        if (writePos >= 0 && readPos && writePos < readPos) {
            // Relocate block
            final.fill(final[readPos], writePos, writePos + blockLength);
            final.fill(FREE_BLOCK, readPos, readPos + blockLength);
        }

        ({ index: readPos, length: blockLength } = lastAllocatedBlock(final, readPos - 1));
        while (readPos > 0 && final[readPos].fileId! > lastMovedFileId) {
            ({ index: readPos, length: blockLength } = lastAllocatedBlock(final, readPos - 1,));
        }

        if (readPos > 0) {
            writePos = freeBlocks.release(blockLength);
        }
    }

    return final;
};
