import { readFileByLine } from "./fs";;

type Digit = number;
export type Mul = { digits: Array<Digit> };

const parseDigits = (data: string): Mul['digits'] => {
    const digits: Mul['digits'] = [];
    
    if (data.startsWith('(') && data.includes(')')) {
        const [l,r] = (data.substring(1).split(')') || [''])[0].split(',') ?? [];
        const [il, ir] = [l,r].map(d => parseInt(d, 10));

        if (`${il}` === l && `${ir}` === r) {
            digits.push(il,ir);
        }
    }

    return digits;
}

const findMulCandidates = (data: string): Array<string> => {
    const [, ...c] = data.split('mul');
    return c;
}

class CommandParser {
    private enabled: boolean = true;

    public findMulCandidates(data: string): Array<string> {
        const c: Array<string> = [];
        const parts = data.split("don't()");

        if (parts.length) {
            if (this.enabled) {
                c.push(...findMulCandidates(parts.shift()!));
            }
            parts.forEach(part => {
                const [,...d] = part.split('do()');
                this.enabled = d !== undefined && d.length > 0;

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

export const loadFromFile = (file: string, enableCommands: boolean = true): Array<Mul> => {
    const parser = new CommandParser();

    return readFileByLine<Array<Mul>>(file, (line: string) =>
        (enableCommands ? parser.findMulCandidates.bind(parser) : findMulCandidates)(line).map(c =>
            ({ digits: parseDigits(c) }) as Mul)
        ).filter(({ digits }) =>
            digits.length === 2);
}

export const calculateMuls = (data: Array<Mul>): number => {
    return data.reduce((acc, cur) => {
        const [l,r] = cur.digits;
        return acc += l * r;
    }, 0);
}
