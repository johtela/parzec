import { ParserInput } from "./parser-input"
import { ParseResult, succeeded, failed } from "./parse-result";

/**
 * Parser type wraps a parsing function. It takes an ParserInput as
 * an argument and returns ParseResult. The type of value to be parsed
 * and the type of terminals in the input stream are given as type
 * parameters T and S.
 */
export type Parser<T, S> = (input: ParserInput<S>) => ParseResult<T>

/**
 * Global settings that control the parser reporting.
 * When debugging flag is on parsers count the number of rules evaluated during
 * their operation. The rulesEvaluated field contains this information. If 
 * errorMessages flag is turned off, the expected information will not be 
 * available in parse errors. This speeds up the parsing nominally.
 */
export var parserSettings = {
    debugging: false,
    errorMessages: true,
    rulesEvaluated: 0
}

/**
 * Attempt to parse an input with a given parser.
 * @param parser Parser to be used.
 * @param input Input stream.
 */
export function tryParse<T, S>(parser: Parser<T, S>, input: ParserInput<S>):
    ParseResult<T> {
    parserSettings.rulesEvaluated = 0
    let res = parser(input)
    if (parserSettings.debugging)
        console.info("Number of rules evaluated: " + parserSettings.rulesEvaluated)
    return res
}

/**
 * Parse an input using a given parser, or throw an exception, if parsing fails.
 * @param parser Parser to be used.
 * @param input Input stream.
 */
export function parse<T, S>(parser: Parser<T, S>, input: ParserInput<S>): T {
    var res = tryParse(parser, input)
    if (!res.success)
        throw Error(`Parse error at ${res.position}.\n` +
            `Found: "${res.found}"\n` +
            `Expected: "${res.expectedAsCsv}"`)
    return res.result
}

/**
 * Create a parser that always succeeds and returns the given value
 * without consuming any input. This function implements the monadic 
 * return, that is, it lifts a value to the parser monad.
 * @param value The value that is returned by the result parser.
 */
export function toParser<T, S>(value: T): Parser<T, S> {
    return input => succeeded(input.position, value)
}

/**
 * Create a parser that always fails.
 * @param found The terminal reported as found.
 * @param expected The terminal reported as expected.
 */
export function fail<T, S>(found: string, expected: string): Parser<T, S> {
    return input => failed(input.position, found, [expected])
}

/**
 * Creates a parser that reads one item from input and returns it, if it 
 * satisfies a given predicate; otherwise the parser will fail.
 * @param predicate The predicate function used to test the value read 
 *                  from the input stream.
 */
export function satisfy<T>(predicate: (value: T) => boolean): Parser<T, T> {
    return input => {
        let pos = input.position
        let next = input.next()
        if (next.done)
            return failed(input.position, "end of input")
        let item = next.value
        if (predicate(item))
            return succeeded(input.position, item)
        let res = failed<T>(input.position, JSON.stringify(item))
        input.position = pos
        return res
    }
}

/**
 * Creates a parser that reads one item from input and returns it, if it
 * does not satisfy a given predicate.
 * @param predicate The predicate function used to test the value read 
 *                  from the input stream.
 */
export function notSatisfy<T>(predicate: (value: T) => boolean): Parser<T, T> {
    return satisfy(x => !predicate(x))
}

/**
 * The monadic bind. Runs the first parser, and if it succeeds, feeds the 
 * result to the second parser. Corresponds to Haskell's >>= operator.
 * @param parser The parser that is executed first.
 * @param func The function that maps the result of the first parser to 
 *             a second parser.
 */
export function bind<T, U, S>(parser: Parser<T, S>, func: (value: T) => Parser<U, S>):
    Parser<U, S> {
    if (parser === null)
        throw Error("Argument 'parser' cannot be null")
    return input => {
        let pos = input.position
        let res1 = parser(input)
        if (res1.success) {
            let res2 = func(res1.result)(input)
            if (!res2.success && pos !== input.position)
                input.position = pos // backtrack
            return res2
        }
        return failed(res1.position, res1.found, res1.expected)
    }
}

/**
 * The sequence operator. Runs the first parser, and if it succeeds, runs the 
 * second parser ignoring the result of the first one.
 * @param parser The first parser.
 * @param other The second parser.
 */
export function then<T, U, S>(parser: Parser<T, S>, other: Parser<U, S>): Parser<U, S> {
    return bind(parser, _ => other)
}

/**
 * The ordered choice operation. Creates a parser that runs the first parser, and if
 * that fails, runs the second one. Corresponds to the / operation in PEG grammars.
 * @param parser The parser to be run first.
 * @param other The parser to be run if the first one fails.
 */
export function or<T, U, S>(parser: Parser<T, S>, other: Parser<U, S>): Parser<T | U, S> {
    return input => {
        let res1 = parser(input)
        if (res1.success)
            return res1
        let res2 = other(input)
        if (res2.success)
            return res2
        return failed(input.position, res2.found, res1.mergeExpected(res2))
    }
}

/**
 * Give a human-readable name to the "thing" that the given parser matches. This
 * name is reported as expected value, if the parsing fails.
 * @param parser The parser to be wrapped.
 * @param expected Name of the symbol or nonterminal that the parser matches.
 */
export function expect<T, S>(parser: Parser<T, S>, expected: string): Parser<T, S> {
    if (!parserSettings.errorMessages)
        return parser
    return input => {
        let res = parser(input)
        return res.success ? res :
            failed(res.position, res.found, [expected].concat(res.expected))
    }
}

/**
 * Runs a parser and checks that it succeeds and that the result it returns
 * satisfies a given predicate.
 * @param parser Parser to be run.
 * @param predicate The predicate function that the result of the parsing 
 *                  must satisfy.
 */
export function where<T, S>(parser: Parser<T, S>, predicate: (value: T) => boolean):
    Parser<T, S> {
    return bind(parser, x =>
        predicate(x) ?
            toParser(x) :
            fail(JSON.stringify(x), "predicate"))
}

/**
 * Creates a parser that will run the given parser zero or more times. The results
 * of the input parser are added to an array.
 * @param parser The parser to run multiple times.
 */
export function zeroOrMore<T, S>(parser: Parser<T, S>): Parser<T[], S> {
    return input => {
        let list: T[] = []
        while (true) {
            let res = parser(input)
            if (!res.success)
                return succeeded(input.position, list)
            list.push(res.result)
        }
    }
}

/**
 * Creates a parser that will run a given parser one or more times. The results
 * of the input parser are added to an array.
 * @param parser The parser to run multiple times.
 */
export function oneOrMore<T, S>(parser: Parser<T, S>): Parser<T[], S> {
    return input => {
        let res = parser(input)
        if (!res.success)
            return failed(input.position, res.found)
        let list = [res.result]
        while (true) {
            res = parser(input)
            if (!res.success)
                return succeeded(input.position, list)
            list.push(res.result)
        }
    }
}

/**
 * Parsing succeeds if the input matches given parser from min to max times.
 * @param parser The parser to be run multiple times.
 * @param min Minimum number of matches.
 * @param max Maximum number of matches.
 */
export function occurrences<T, S>(parser: Parser<T, S>, min: number, max: number):
    Parser<T[], S> {
    return bind(zeroOrMore(parser), list => {
        let cnt = list.length
        return cnt >= min && cnt <= max ?
            toParser(list) :
            fail(`${cnt} occurrences`, `${min}-${max} occurrences`)
    })
}

/**
 * Optionally parses an input, if the parser fails then the default value is returned.
 * @param parser The optional parser to be converted optional.
 * @param defaultValue The value returned if parser fails. If no parameter given,
 *                     null is returned.
 */
export function optional<T, S>(parser: Parser<T, S>, defaultValue: T | null = null): 
    Parser<T | null, S> {
    return or(parser, toParser(defaultValue))
}

/**
 * Check that the given parser succeeds without consuming any input. Corresponds 
 * to the & operator in the PEG grammars.
 * @param parser The parser that matches the required input.
 */
export function and<T, S>(parser: Parser<T, S>): Parser<T, S> {
    return input => {
        let pos = input.position
        let res = parser(input)
        input.position = pos
        return res
    }
}

