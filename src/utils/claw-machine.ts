import { readFileByLineBatch } from './fs';

type Offset = {
    X: number;
    Y: number;
};

type Location = {
    X: number;
    Y: number;
};

type ClawMachine = {
    buttons: {
        A: Offset;
        B: Offset;
    };
    prize: Location;
};

const parseButton = (info: string): Offset => {
    const [X, Y] = info.match(/\d+/gu)!;
    return { X: Number(X), Y: Number(Y) };
};

const parsePrize = (info: string): Location => {
    const [X, Y] = info.match(/\d+/gu)!;
    return { X: Number(X), Y: Number(Y) };
};

const parseMachine = ([buttonA, buttonB, prize]: string[]): ClawMachine => ({
    buttons: {
        A: parseButton(buttonA),
        B: parseButton(buttonB)
    },
    prize: parsePrize(prize)
});

export const loadFromFile = (filename: string): ClawMachine[] => readFileByLineBatch<ClawMachine>(filename, parseMachine, 4);

type Solution = {
    A: number;
    B: number;
};

export const solve = (machine: ClawMachine): Solution => {
    const coeffA = [machine.buttons.A.X, machine.prize.X].map(v => v * machine.buttons.B.Y);
    const coeffB = [machine.buttons.A.Y, machine.prize.Y].map(v => v * machine.buttons.B.X);

    const solvedA = (coeffA[1] - coeffB[1]) / (coeffA[0] - coeffB[0]);
    if (solvedA !== Math.floor(solvedA)) {
        return { A: 0, B: 0 };
    }

    const solvedB = (machine.prize.X - (solvedA * machine.buttons.A.X)) / machine.buttons.B.X;
    if (solvedB !== Math.floor(solvedB)) {
        return { A: 0, B: 0 };
    }

    return { A: solvedA, B: solvedB };
};

export const cost = (machine: ClawMachine): number => {
    const { A, B } = solve(machine);
    return (3 * A) + B;
};
