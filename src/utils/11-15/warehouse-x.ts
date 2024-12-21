import { Coords, Direction, StringArray2D } from '../array2d';
import { readFileByLine } from '../fs';

type Layout = StringArray2D;
type Warehouse = {
    layout: Layout;
    movement: Direction[];
};

const parseDirection = (string: string): Direction => {
    switch (string) {
        case '^':
            return Direction.NORTH;
            break;
        case '>':
            return Direction.EAST;
            break;
        case 'v':
            return Direction.SOUTH;
            break;
        case '<':
            return Direction.WEST;
            break;
        default:
            throw new Error('Invalid directional input');
            break;
    }
};

const WALL = '#';
const EMPTY = '.';
const BOX = 'O';
const ROBOT = '@';
const BOX_LEFT = '[';
const BOX_RIGHT = ']';

const parseMap = (string: string): string[] => {
    switch (string) {
        case ROBOT:
            return [ROBOT, EMPTY];
            break;
        case BOX:
            return [BOX_LEFT, BOX_RIGHT];
            break;
        default:
            return Array(2).fill(string);
            break;
    }
};

export const loadFromFile = (filename: string): Warehouse => {
    const layout: string[][] = [];
    const movement: Direction[][] = [];

    readFileByLine(filename, line => {
        if (line.includes('#')) {
            layout.push(Array.from(line).flatMap(parseMap));
        }
        else {
            movement.push(Array.from(line).map(parseDirection));
        }
    });

    return { layout: new StringArray2D().loadFromData(layout), movement: movement.flat() };
};

type StackItem = {
    pos: Coords;
    item: string;
};

type Stack = StackItem[];

type FnGetMoveableStack = (grid: Layout, from: Coords, facing: Direction) => Stack;

const getMoveableHorizontalStack = (grid: Layout, from: Coords, facing: Direction): Stack => {
    const stack: Stack[] = [];

    let pos = from;
    while ([WALL, EMPTY].includes(grid.at(pos)!) === false) {
        pos = grid.step(pos, facing)!;
        stack.push([{ item: grid.at(pos)!, pos }]);
    }

    if (stack.length) {
        if (stack[stack.length - 1][0].item === WALL) {
            return [];
        }
    }

    return stack.flat();
};

const expandBoxes = (grid: Layout, pos: Coords): Stack => {
    const stack = [{ item: grid.at(pos)!, pos }];

    // Boxes are double size so get other half
    if (grid.at(pos) === BOX_LEFT) {
        const otherPos = grid.step(pos, Direction.EAST)!;
        stack.push({ item: BOX_RIGHT, pos: otherPos });
    }
    else if (grid.at(pos) === BOX_RIGHT) {
        const otherPos = grid.step(pos, Direction.WEST)!;
        stack.push({ item: BOX_LEFT, pos: otherPos });
    }

    return stack;
};

export const onlyUniqueStackItem = (value: StackItem, index: number, array: Stack): boolean => array.findIndex(({ pos: { i, j } }) => i === value.pos.i && j === value.pos.j) === index;

// eslint-disable-next-line max-statements
const getMoveableVerticalStack = (grid: Layout, from: Coords, facing: Direction): Stack => {
    const stacks: Stack[] = [[{ item: ROBOT, pos: from }]];

    let finished = false;
    while (finished === false) {
        const stack: Stack = [];
        stacks[stacks.length - 1].forEach(({ pos: loc }) => {
            stack.push(...expandBoxes(grid, grid.step(loc, facing)!));
        });

        finished = stack.some(({ item }) => item === WALL);
        if (finished) {
            return [];
        }

        const boxes = stack.filter(({ item }) => item !== EMPTY);
        if (boxes.length) {
            stacks.push(boxes.filter(onlyUniqueStackItem));
        }
        else {
            if (stacks.length === 1) {
                stacks.push([{ item: EMPTY, pos: from }]);
            }
            finished = true;
        }
    }

    stacks.splice(0, 1);

    // console.log({ fn: 'getMoveableVerticalStack', stacks: JSON.stringify(stacks) });
    return stacks.flat();
};

const getMoveableStack: Record<Direction, FnGetMoveableStack> = {
    [Direction.NORTH]: getMoveableVerticalStack,
    [Direction.EAST]: getMoveableHorizontalStack,
    [Direction.SOUTH]: getMoveableVerticalStack,
    [Direction.WEST]: getMoveableHorizontalStack,
};

type FnMoveStack = (stack: Stack, layout: Layout, facing: Direction) => void;

const moveHorizontalStack = (stack: Stack, layout: Layout, facing: Direction): void => {
    const positions = stack.map(v => ({ ...v }));
    layout.mark(positions.shift()!.pos, EMPTY);

    while (positions.length > 1) {
        const [boxLeft, boxRight] = positions.splice(0, 2);
        layout.mark(boxLeft.pos, facing === Direction.EAST ? BOX_LEFT : BOX_RIGHT);
        layout.mark(boxRight.pos, facing === Direction.EAST ? BOX_RIGHT : BOX_LEFT);
    }
};

const moveVerticalStack = (stack: Stack, layout: Layout, facing: Direction): void => {
    const positions = stack.map(v => ({ ...v }));

    positions.reverse()?.forEach(box => {
        const newPos = layout.step(box.pos, facing)!;
        // console.log({ pos: box.pos, newPos, facing });
        layout.mark(newPos, box.item);
        layout.mark(box.pos, EMPTY);
    });
};

const moveStack: Record<Direction, FnMoveStack> = {
    [Direction.NORTH]: moveVerticalStack,
    [Direction.EAST]: moveHorizontalStack,
    [Direction.SOUTH]: moveVerticalStack,
    [Direction.WEST]: moveHorizontalStack,
};

export const applyMovements = ({ layout, movement }: Warehouse): Layout => {
    const newLayout = new StringArray2D().loadFromData(layout.grid);
    let posRobot = newLayout.find('@')!;
    // console.log({ posRobot });

    movement.forEach(direction => {
        const objects = getMoveableStack[direction](newLayout, posRobot, direction);
        // console.log(newLayout.grid.map(r => r.join('')).join('\n'));
        if (objects.length > 1) {
            // Moveable so move it
            moveStack[direction](objects, newLayout, direction);
        }

        if (objects.length > 0) {
            newLayout.mark(posRobot, EMPTY);
            posRobot = newLayout.step(posRobot, direction)!;
            newLayout.mark(posRobot, ROBOT);
        }
    });

    return newLayout;
};

export const sumBoxPositions = (layout: Layout): number => layout.findAll(BOX_LEFT).reduce<number>((acc, cur) => acc + 100 * cur.i + cur.j, 0);
