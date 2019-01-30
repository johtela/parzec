export enum ErrorSource { 
    Input = "Input", 
    Lexer = "Lexer", 
    Parser = "Parsing" 
}

export class ParseError extends Error {
    source: ErrorSource
    position: number
    found: string
    expected: string[]

    constructor(source: ErrorSource, position: number,
        found: string, expected: string[] = []) {
        super(`${source} error at position ${position}.\n` +
            `\tFound: "${found}"\n` + 
            `\tExpected: ${expected.map(s => `"${s}"`).join(", ")}`);
        this.source = source
        this.position = position
        this.found = found
        this.expected = expected
    }
}