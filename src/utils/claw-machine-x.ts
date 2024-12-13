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

const PRIZE_CONVERSION = 10000000000000;

const parsePrize = (info: string): Location => {
    const [X, Y] = info.match(/\d+/gu)!;
    return { X: Number(X) + PRIZE_CONVERSION, Y: Number(Y) + PRIZE_CONVERSION };
};

const parseMachine = ([buttonA, buttonB, prize]: string[]): ClawMachine => ({
    buttons: {
        A: parseButton(buttonA),
        B: parseButton(buttonB)
    },
    prize: parsePrize(prize)
});

export const loadFromFile = (filename: string): ClawMachine[] => readFileByLineBatch<ClawMachine>(filename, parseMachine, 4);
