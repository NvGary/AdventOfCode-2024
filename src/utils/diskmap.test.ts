/* eslint-disable @stylistic/array-element-newline */
import { type DiskMap, FREE_BLOCK, checksum, defragment, loadFromFile } from '../utils/diskmap';

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

describe('diskmap utils', () => {
    describe('function loadFromFile', () => {
        it('loads decompressed diskmap', () => {
            const res = loadFromFile('./lib/test/diskmap.txt');

            expect(res).toEqual(diskMap);
            expect(toString(res)).toBe('00...111...2...333.44.5555.6666.777.888899');
        });
    });

    describe('function defragment', () => {
        it('defragments as expected', () => {
            const res = defragment(diskMap);
            expect(toString(res)).toBe('0099811188827773336446555566..............');
        });
    });

    describe('function checksum', () => {
        it('generates correct checksum', () => {
            const res = defragment(diskMap);
            expect(checksum(res)).toBe(1928);
        });
    });
});
