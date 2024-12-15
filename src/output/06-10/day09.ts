import { checksum, defragment, loadFromFile } from '../../utils/06-10/diskmap';
import { defragment as defragmentEx } from '../../utils/06-10/diskmap-ex';

export const day09 = () => {
    console.log('--- Day 9: Disk Fragmenter ---');

    const disk = loadFromFile('./lib/06-10/diskmap.txt');

    // 6283170117911
    console.log(`Resulting filesystem checksum: ${checksum(defragment(disk))}`);

    // 6307653242596
    console.log(`Resulting filesystem checksum: ${checksum(defragmentEx(disk))}`);
};
