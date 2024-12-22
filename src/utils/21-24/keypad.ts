import { StringArray2D } from '../array2d';
import { convertToDirections, Direction } from '../array2d/array2d';
import { readFileByLine } from '../fs';
import { Legend, StepPriorityMaze } from '../maze';

export const loadFromFile = (filename: string): string[] => readFileByLine(filename, line => line);

const enum Key {
    ENTER = 'A',
}
const numericalKeypad = new StringArray2D().loadFromData([
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    [Legend.WALL, '0', Key.ENTER]
]);

const directionalKeypad = new StringArray2D().loadFromData([
    [Legend.WALL, '^', Key.ENTER],
    ['<', 'v', '>']
]);

const keypadSort = (a: number, b: number): number => (a + 5 % 4) - (b + 5 % 4);

const toDirectionalString = (direction: Direction): string => {
    switch (direction) {
        case Direction.NORTH:
            return '^';
            break;
        case Direction.EAST:
            return '>';
            break;
        case Direction.SOUTH:
            return 'v';
            break;
        case Direction.WEST:
            return '<';
            break;
        default:
            break;
    }

    return '';
};

const PRIORITY: Record<string, number> = {
    '<': 0,
    'v': 1,
    '^': 2,
    '>': 3,
    'A': 4
};

const PRIORITY_0: Record<string, number> = {
    '^': 0,
    '>': 1,
    'v': 2,
    '<': 3,
    'A': 4
};

const sortPriortity = (a: string, b: string): number => PRIORITY[a] - PRIORITY[b];
const sortPriortity0 = (a: string, b: string): number => PRIORITY_0[a] - PRIORITY_0[b];

const optimiseNumerical = (directions: string, idx: number): string => {
    // console.log({ idx, directions });
    switch (directions) {
        // case '<<^':
        //     return '^<<';
        //     break;

        default:
            if (idx === 0) {
                return Array.from(directions).sort(sortPriortity0).join('');
            }

            return Array.from(directions).sort(sortPriortity).join('');
    }
};

const optimiseDirectional = (directions: string, idx: number): string => {
    // console.log({ idx, directions });
    switch (directions) {
        case '<<v':
        case 'v<<':
            return 'v<<';
            break;

        case '^>>':
        case '>>^':
            return '>>^';
            break;

        default:
            if (idx === 0) {
                return Array.from(directions).sort(sortPriortity0).join('');
            }

            return Array.from(directions).sort(sortPriortity).join('');
    }
};

export const fromNumerical = (code: string): string => {
    let keypad = new StepPriorityMaze(numericalKeypad);
    let start = numericalKeypad.find(Key.ENTER)!;

    const keyPresses: string[] = Array.from(code).map(digit => {
        const end = numericalKeypad.find(digit)!;
        const [{ route }] = keypad.solve({ start, end });
        // console.log({ start, end, route })

        start = end;
        keypad = new StepPriorityMaze(numericalKeypad);

        return convertToDirections(route.concat(end)).map(toDirectionalString).join('');
    });

    // console.log(JSON.stringify(keyPresses));
    keyPresses.push('');
    return keyPresses.map(optimiseNumerical).join('A');
};

export const fromDirectional = (code: string): string => {
    let keypad = new StepPriorityMaze(directionalKeypad);
    let start = directionalKeypad.find(Key.ENTER)!;

    const keyPresses: string[] = Array.from(code).map(digit => {
        const end = directionalKeypad.find(digit)!;
        const [{ route }] = keypad.solve({ start, end });
        // console.log({ start, end, route })

        start = end;
        keypad = new StepPriorityMaze(directionalKeypad);

        return convertToDirections(route.concat(end)).map(toDirectionalString).join('');
    });

    // console.log(JSON.stringify(keyPresses));
    keyPresses.push('');
    return keyPresses.map(optimiseDirectional).join('A');
};

export const complexity = (code: string): number => {
    const numericPart = parseInt(code, 10);

    const rob1 = fromNumerical(code);
    const rob2 = fromDirectional(rob1);
    const rob3 = fromDirectional(rob2);

    // console.log({ code, rob1, rob2, rob3 });
    return rob3.length * numericPart;
};
