/* eslint-disable @stylistic/array-element-newline */
import { type DiskMap, FREE_BLOCK, checksum } from '../utils/diskmap';
import { defragment } from '../utils/diskmap-ex';

const diskMap = [
    { fileId: 0 }, { fileId: 0 },
    FREE_BLOCK, FREE_BLOCK, FREE_BLOCK,
    { fileId: 1 }, { fileId: 1 }, { fileId: 1 },
    FREE_BLOCK, FREE_BLOCK, FREE_BLOCK,
    { fileId: 2 },
    FREE_BLOCK, FREE_BLOCK, FREE_BLOCK,
    { fileId: 3 }, { fileId: 3 }, { fileId: 3 },
    FREE_BLOCK,
    { fileId: 4 }, { fileId: 4 },
    FREE_BLOCK,
    { fileId: 5 }, { fileId: 5 }, { fileId: 5 }, { fileId: 5 },
    FREE_BLOCK,
    { fileId: 6 }, { fileId: 6 }, { fileId: 6 }, { fileId: 6 },
    FREE_BLOCK,
    { fileId: 7 },
    { fileId: 7 },
    { fileId: 7 },
    FREE_BLOCK,
    { fileId: 8 }, { fileId: 8 }, { fileId: 8 }, { fileId: 8 },
    { fileId: 9 }, { fileId: 9 },
];

const toString = (disk: DiskMap): string => disk.map<string>(block => `${block.fileId ?? '.'}`).join('');

describe('diskmap-ex utils', () => {
    describe('function defragment', () => {
        it('defragments as expected', () => {
            const res = defragment(diskMap);
            expect(toString(res)).toBe('00992111777.44.333....5555.6666.....8888..');
            expect(checksum(res)).toBe(2858);
        });
    });
});
