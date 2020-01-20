/**
 * # Parser Result
 * 
 * The result of a parser function is a discriminated union that
 * represents either success or failure. In both cases need the 
 * `position` field to indicate where in the input stream we are. 
 * This is field is defined in the base interface.
 */
interface Position {
    position: number
}
/**
 * When parsing succeeds we return the the `Ok<T>` object. It contains
 * the `result` returned by the parser. Type parameter `T` indicates 
 * its type. 
 */
interface Ok<T> extends Position {
    kind: "ok"
    result: T
}
/**
 * When parsing fails we return the `Fail` object. It does not have a 
 * result, but information about the input `found` and input `expected`. 
 */
interface Fail extends Position {
    kind: "fail"
    found: string
    expected: string[]
}
/**
 * The actual result type is a discriminated union of the `Ok<T>` and 
 * `Fail` objects.
 */
export type ParseResult<T> = Ok<T> | Fail

/**
 * ## Helper Functions
 * 
 * The `joinExpected` function concatenates the list of expected
 * inputs from the `other` failed parse result into the `expected` 
 * array of the first one.  
 */
export function joinExpected(result: Fail, other: Fail) {
    if (other.expected.length > 0)
        result.expected = result.expected.concat(other.expected)
}
/**
 * This function formats the array of expected inputs as a string for
 * printing.
 */
export function expectedAsCsv(result: Fail): string {
        return result.expected.map(s => `"${s}"`).join(", ")
}

/**
 * ## Constructor Functions
 * 
 * The following function is used to construct an `Ok<T>` result. 
 */
export function succeeded<T>(pos: number, res: T): ParseResult<T> {
    return {
        kind: "ok",
        position: pos, 
        result: res
    }
}
/**
 * The next one constructs a `Fail` result.
 */
export function failed<T>(pos: number, fnd: string, exp: string[] = []): ParseResult<T> {
    return {
        kind: "fail",
        position: pos, 
        found: fnd, 
        expected: exp
    }
}