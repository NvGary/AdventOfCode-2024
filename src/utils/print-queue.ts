import { readFileByLine } from "./fs";

type PrintQueue = { ordering: Array<Array<number>>, production: Array<Array<number>> };

const parseOrdering = (string: string): number => parseInt(string, 10);
const parseProduction = (string: string): number => parseInt(string, 10);

export const loadFromFile = (fileName: string): PrintQueue => {
    const ordering = readFileByLine(fileName, line => {
        if (line.includes('|')) {
            return [line.split('|').map(parseOrdering)];
        } else {
            return [];
        }
    });

    const production = readFileByLine(fileName, line => {
        if (line.includes(',')) {
            return [line.split(',').map(parseProduction)];
        } else {
            return [];
        }
    });

    return { ordering, production };
}

const _hasCorrectOrdering = (production: PrintQueue['production'][number], ordering: PrintQueue['ordering']): boolean => {
    return production.reduce<boolean>((acc, cur, idx) => {
        // console.log({ acc, cur, idx });
        return acc && production.slice(idx + 1).reduce<boolean>((acc2, cur2) => {
            // console.log({ acc2, cur2, 'ordering includes': [cur, cur2], res: ordering.some(([l,r]) => cur === l && cur2 === r) });
            return acc2 && ordering.some(([l,r]) => cur === l && cur2 === r);
        }, true)
    }, true);
}

export const hasCorrectOrdering = ({ ordering, production }: PrintQueue): PrintQueue['production'] => {
    // console.log({ production, ordering });
    return production.filter(entry => _hasCorrectOrdering(entry, ordering));
}

export const hasIncorrectOrdering = ({ ordering, production }: PrintQueue): PrintQueue['production'] => {
    // console.log({ production, ordering });
    return production.filter(entry => !_hasCorrectOrdering(entry, ordering));
}

export const calculateProductionTotals = (production: PrintQueue['production']): number => {
    return production.reduce<number>((acc, cur) => {
        return acc + cur[(cur.length - 1) / 2];
    }, 0);
}

// const _correctOrdering = (production: PrintQueue['production'][number], ordering: PrintQueue['ordering']): PrintQueue['production'][number] => {
//     console.log({ fn: '_correctOrdering', production });
//     const res: PrintQueue['production'][number] = [];
//     const data = Array.from(production);
//     let [lPage,rPage] = data.splice(0, 2);
//     let abort = false;

//     console.log({ lPage, rPage, abort });
//     while (!abort && rPage) {
//         if (ordering.some(([l,r]) => lPage === l && rPage === r)) {
//             res.push(lPage);
//             data.unshift(rPage);
//             [lPage,rPage] = data.splice(0, 2);
//         } else if (ordering.some(([r,l]) => lPage === l && rPage === r)) {
//             res.push(rPage);
//             data.unshift(lPage);
//             [lPage,rPage] = data.splice(0, 2);
//         } else {
//             abort = true;
//             res.push(lPage);
//             data.unshift(rPage);
//         }
//     }

//     console.log({ fn: '_corrrectOrdering', res, data });
//     return [...res, ...data];
// }

const _correctOrdering = (production: PrintQueue['production'][number], ordering: PrintQueue['ordering']): PrintQueue['production'][number] => {
    return production.sort((a,b) => ordering.some(([l,r]) => a === l && b === r) ? -1 : ordering.some(([r,l]) => a === l && b === r) ? 1: 0)
}

export const correctOrdering = ({ ordering, production }: PrintQueue): PrintQueue['production'] => {
    return production.filter(entry => _hasCorrectOrdering(_correctOrdering(entry, ordering), ordering));
}