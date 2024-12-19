import { readFileByLine } from '../fs';
import { memoise } from '../memoise';

type Towels = {
    patterns: string[];
    designs: string[];
};

export const loadFromFile = (filename: string): Towels => {
    const patterns: string[] = [];
    const designs: string[] = [];

    readFileByLine(filename, line => {
        if (line.includes(',')) {
            patterns.push(...line.split(',').map(s => s.trim()));
        }
        else {
            designs.push(line);
        }
    });

    return { patterns, designs };
};

const solve = memoise((design: Towels['designs'][number], patterns: Towels['patterns']): number => {
    let solutionCount = 0;

    for (let i = 0; i < patterns.length; ++i) {
        const pattern = patterns[i];

        if (design === pattern) {
            solutionCount++;
        }
        else if (design.startsWith(pattern)) {
            const remainingDesign = design.slice(pattern.length);
            solutionCount += solve(remainingDesign, patterns);
        }
    }

    return solutionCount;
});

export const determineSolveable = ({ designs, patterns }: Towels): { design: Towels['designs'][number]; solutions: number }[] => {
    const solveable = designs.map(
        design => ({ design, solutions: solve(design, patterns.sort((a, b) => b.length - a.length)) })).filter(({ solutions }) => solutions);

    return solveable;
};
