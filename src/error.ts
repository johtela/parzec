/**
 * # Error Reporting
 *
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
 * The ParseError class contains information about the parsing error in
 * an easily accessible form.
 */
export class ParseError extends Error {
    constructor(
        /**
         * The source of the error.
         */
        readonly source: ErrorSource,
        /**
         * The position where the error happened.
         */
        readonly position: number,
        /**
         * Input found at `position`.
         */
        readonly found: string, 
        /**
         * Input expected at `position`. There can be multiple terminals.
         */
        readonly expected: string[] = []) {
        /**
         * Constructor formats the error message using the parameters provided.
         */
        super(`${source} error at position ${position}.\n` +
            `\tFound: "${found}"\n` +
            `\tExpected: ${expected.map(s => `"${s}"`).join(", ")}`);
    }
}