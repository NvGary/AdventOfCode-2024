import { readFileByLine } from "./fs";;

type Digit = number;
export interface Mul { digits: Digit[] }

const findMulCandidates = (data: string): string[] => {
    const [, ...c] = data.split('mul');
    return c;
}

const parseDigits = (data: string): Mul['digits'] => {
    const digits: Mul['digits'] = [];
    
    if (data.startsWith('(') && data.includes(')')) {
        const [l,r] = (data.substring(1).split(')') || [''])[0].split(',') ?? [],
         [il, ir] = [l,r].map(d => parseInt(d, 10));

        if (`${il}` === l && `${ir}` === r) {
            digits.push(il,ir);
        }
    }

    return digits;
}

class CommandParser {
    private enabled = true;

    public findMulCandidates(data: string): string[] {
        const c: string[] = [],
         parts = data.split("don't()");

        if (parts.length) {
            if (this.enabled) {
                c.push(...findMulCandidates(parts.shift() as string));
            }
            parts.forEach(part => {
                const [,...d] = part.split('do()');
                this.enabled = d && d.length > 0;

                if (this.enabled) {
                    d.forEach(p => {
                        c.push(...findMulCandidates(p));
                    });
                }
            });
        }

        return c;
    }
}

export const loadFromFile = (file: string, enableCommands = true): Mul[] => {
    const parser = new CommandParser();

    return readFileByLine<Mul[]>(file, (line: string) =>
        (enableCommands ? parser.findMulCandidates.bind(parser) : findMulCandidates)(line).map(c =>
            ({ digits: parseDigits(c) }) as Mul)
        ).filter(({ digits }) =>
            digits.length === 2);
}

export const calculateMuls = (data: Mul[]): number => data.reduce((acc, cur) => {
        const [l,r] = cur.digits;
        return acc + l * r;
    }, 0)
