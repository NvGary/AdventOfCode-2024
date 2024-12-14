import { readFileByLine } from '../fs';

type PrintQueue = { ordering: Array<Array<number>>; production: Array<Array<number>> };

const parseOrdering = (string: string): number => parseInt(string, 10);
const parseProduction = (string: string): number => parseInt(string, 10);

export const loadFromFile = (filename: string): PrintQueue => {
    const ordering: number[][] = [];
    const production: number[][] = [];

    readFileByLine(filename, line => {
        if (line.includes('|')) {
            ordering.push(line.split('|').map(parseOrdering));
        }
        else if (line.includes(',')) {
            production.push(line.split(',').map(parseProduction));
        }
        return null;
    });

    return { ordering, production };
};

const hasCorrectOrdering_impl = (production: PrintQueue['production'][number], ordering: PrintQueue['ordering']): boolean =>
    production.reduce<boolean>((acc, cur, idx) =>
        acc && production.slice(idx + 1).reduce<boolean>((acc2, cur2) =>
            acc2 && ordering.some(([l, r]) => cur === l && cur2 === r)
        , true)
    , true);

export const hasCorrectOrdering = ({ ordering, production }: PrintQueue): PrintQueue['production'] =>
    production.filter(entry => hasCorrectOrdering_impl(entry, ordering));

export const hasIncorrectOrdering = ({ ordering, production }: PrintQueue): PrintQueue['production'] =>
    production.filter(entry => !hasCorrectOrdering_impl(entry, ordering));

export const calculateProductionTotals = (production: PrintQueue['production']): number => production.reduce<number>((acc, cur) => acc + cur[(cur.length - 1) / 2], 0);

export const correctOrdering = ({ ordering, production }: PrintQueue): PrintQueue['production'] =>
    production.filter(entry => hasCorrectOrdering_impl(
        entry.sort((a, b) => ordering.some(([l, r]) => a === l && b === r) ? -1 : ordering.some(([r, l]) => a === l && b === r) ? 1 : 0),
        ordering
    ));
