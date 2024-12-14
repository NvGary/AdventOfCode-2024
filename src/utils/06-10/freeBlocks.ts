import type { Block, DiskMap } from './diskmap.types';

export const FREE_BLOCK: Block = { fileId: null };

type FreeBlockData = {
    pos: number;
    span: number;
};

export class FreeBlocks {
    private blocks: Record<number, FreeBlockData[]> = [];
    private maxLength = 0;

    public build(disk: DiskMap): void {
        this.blocks = [];

        let freePos = disk.indexOf(FREE_BLOCK);

        while (freePos > -1 && freePos < disk.length) {
            const allocatedPos = disk.findIndex((block, idx) => block !== FREE_BLOCK && idx > freePos);

            const length = (allocatedPos === -1) ? disk.length - freePos : allocatedPos - freePos;
            this.maxLength = Math.max(length, this.maxLength);
            this.add({ pos: freePos, span: length });

            freePos = disk.indexOf(FREE_BLOCK, freePos + length);
        }

        // console.log({ freeBlocks: this.blocks });
    }

    private add({ pos, span }: FreeBlockData): void {
        for (let i = span; i > 0; --i) {
            this.blocks[i] ||= [];
            this.blocks[i] = [{ pos, span }].concat(this.blocks[i]).sort((a, b) => a.pos - b.pos);
        }
    }

    public release(length: number): number {
        if (this.blocks[length] && this.blocks[length].length) {
            const { pos, span } = this.blocks[length].shift()!;

            for (let i = span; i > 0; --i) {
                this.blocks[i] = this.blocks[i].filter(p => p.pos !== pos);
            }

            this.add({ pos: pos + length, span: span - length });
            return pos;
        }

        return -1;
    }
}
