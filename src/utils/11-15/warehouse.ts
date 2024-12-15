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

export const loadFromFile = (filename: string): Warehouse => {
    const layout: string[][] = [];
    const movement: Direction[][] = [];

    readFileByLine(filename, line => {
        if (line.includes('#')) {
            layout.push(Array.from(line));
        }
        else {
            movement.push(Array.from(line).map(parseDirection));
        }
    });

    return { layout: new StringArray2D().loadFromData(layout), movement: movement.flat() };
};

const WALL = '#';
const EMPTY = '.';
const BOX = 'O';
const ROBOT = '@';

type Stack = {
    pos: Coords;
    item: string;
}[];

const getMoveableStack = (grid: Layout, from: Coords, facing: Direction): Stack => {
    const stack: Stack = [];

    // console.log({ fn: 'getMoveableStack', from, facing });

    let pos = from;
    while ([WALL, EMPTY].includes(grid.at(pos)!) === false) {
        pos = grid.step(pos, facing)!;
        stack.push({ item: grid.at(pos)!, pos });
    }

    if (stack.length) {
        if (stack[stack.length - 1].item === WALL) {
            // console.log('Stack termiantes with a wall ... emptying');
            return [];
        }
    }

    return stack;
};

export const applyMovements = ({ layout, movement }: Warehouse): Layout => {
    const newLayout = new StringArray2D().loadFromData(layout.grid);
    let posRobot = newLayout.find('@');
    // console.log({ posRobot });

    movement.forEach(direction => {
        const objects = getMoveableStack(newLayout, posRobot, direction);
        // console.log(newLayout.grid.map(r => r.join('')).join('\n'));
        // console.log({ stack: objects, posRobot, direction });
        if (objects.length > 1) {
            // Moveable so move it
            newLayout.mark(objects.pop()!.pos, BOX);
            newLayout.mark(objects[0].pos, EMPTY);
        }

        if (objects.length > 0) {
            newLayout.mark(posRobot, EMPTY);
            posRobot = newLayout.step(posRobot, direction)!;
            newLayout.mark(posRobot, ROBOT);
        }
    });

    return newLayout;
};

export const sumBoxPositions = (layout: Layout): number => layout.findAll(BOX).reduce<number>((acc, cur) => acc + 100 * cur.i + cur.j, 0);
