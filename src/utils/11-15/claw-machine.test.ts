import { cost, loadFromFile, solve } from './claw-machine';

describe('claw machine X utils', () => {
    let machines: ReturnType<typeof loadFromFile>;

    beforeEach(() => {
        machines = loadFromFile('./lib/11-15/test/arcade.txt');
    });

    describe('function loadFromFile', () => {
        it('loads machine data corretly', () => {
            expect(machines).toHaveLength(4);
            expect(machines[0]).toEqual({
                buttons: { A: { X: 94, Y: 34 }, B: { X: 22, Y: 67 } }, prize: { X: 8400, Y: 5400 }
            });
            expect(machines.pop()).toEqual({
                buttons: { A: { X: 69, Y: 23 }, B: { X: 27, Y: 71 } }, prize: { X: 18641, Y: 10279 }
            });
        });
    });

    describe('function solve', () => {
        it('finds appropriate solution', () => {
            expect(solve(machines[0])).toEqual({ A: 80, B: 40 });
            expect(solve(machines[1])).toEqual({ A: 0, B: 0 });
            expect(solve(machines[2])).toEqual({ A: 38, B: 86 });
            expect(solve(machines[3])).toEqual({ A: 0, B: 0 });
        });
    });

    describe('function cost', () => {
        it('calculates cost', () => {
            expect(cost(machines[0])).toBe(280);
            expect(cost(machines[1])).toBe(0);
            expect(cost(machines[2])).toBe(200);
            expect(cost(machines[3])).toBe(0);
        });
    });
});
