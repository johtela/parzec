/**
 * Possible sources of errors.
 */
export enum ErrorSource { 
    Input = "Input", 
    Lexer = "Lexer", 
    Parser = "Parsing" 
}

/**
 * Error class for parsing and lexing errors.
 */
export class ParseError extends Error {
    source: ErrorSource
    position: number
    found: string
    expected: string[]

    /**
     * Create a parsing error object. Calls the inherited constructor
     * with a readable error message.
     * @param source The source of the error.
     * @param position The position where the error happened.
     * @param found Input found at `position`.
     * @param expected Input expected at `position`.
     */
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