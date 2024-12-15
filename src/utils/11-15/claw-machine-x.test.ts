import { loadFromFile } from './claw-machine-x';

describe('claw machine utils', () => {
    let machines: ReturnType<typeof loadFromFile>;

    beforeEach(() => {
        machines = loadFromFile('./lib/11-15/test/arcade.txt');
    });

    describe('function loadFromFile', () => {
        it('loads machine data corretly', () => {
            expect(machines).toHaveLength(4);
            expect(machines[0]).toEqual({
                buttons: { A: { X: 94, Y: 34 }, B: { X: 22, Y: 67 } }, prize: { X: 10000000000000 + 8400, Y: 10000000000000 + 5400 }
            });
            expect(machines.pop()).toEqual({
                buttons: { A: { X: 69, Y: 23 }, B: { X: 27, Y: 71 } }, prize: { X: 10000000000000 + 18641, Y: 10000000000000 + 10279 }
            });
        });
    });
});
