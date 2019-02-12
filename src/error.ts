/**
 * Error Reporting
 * ===============
 * We define a custom Error class for parsing errors.
 * 
 * The possible sources of errors are defined in the enumeration below.
 */
export enum ErrorSource { 
    Input = "Input", 
    Lexer = "Lexer", 
    Parser = "Parsing" 
}
/**
 * The ParsError class contains information about the parsing error in
 * an easily accessible form.
 */
export class ParseError extends Error {
    /**
     * The source of the error.
     */
    source: ErrorSource
    /**
     * The position where the error happened.
     */
    position: number
    /**
     * Input found at `position`.
     */
    found: string
    /**
     * Input expected at `position`. There can be multiple terminals.
     */
    expected: string[]
    /**
     * Create a parsing error object. Calls the inherited constructor
     * with a readable error message.
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