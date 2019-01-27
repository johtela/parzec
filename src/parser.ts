import { ParserInput } from "./parserinput"
import { ParseResult, succeeded, failed } from "./parseresult";

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
export const parserDebug = {
    debugging: false,
    errorMessages: true,
    rulesEvaluated: 0,
    indentation: 0,
    indent() {
        this.indentation++
    },
    unindent() {
        this.indentation--
    },
    write(text: string) {
        let tabs = "  ".repeat(this.indentation)
        console.log(tabs + text)
    }
}

/**
 * Attempt to parse an input with a given parser.
 * @param parser Parser to be used.
 * @param input Input stream.
 */
export function tryParse<T, S>(parser: Parser<T, S>, input: ParserInput<S>):
    ParseResult<T> {
    parserDebug.rulesEvaluated = 0
    let res = parser(input)
    if (parserDebug.debugging)
        console.info("Number of rules evaluated: " + parserDebug.rulesEvaluated)
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
        let res = failed<T>(input.position, `${item}`)
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
    if (!parserDebug.errorMessages)
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
            fail(`${x}`, "predicate"))
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
 * Parse an optional value, if the parser fails then the default value is returned.
 * @param parser The parser to be converted optional.
 * @param defaultValue The value returned if parser fails.
 */
export function optional<T, S>(parser: Parser<T, S>, defaultValue: T):
    Parser<T, S> {
    return or(parser, toParser(defaultValue))
}

/**
 * Parse an optional reference value, if the parser fails then null is returned.
 * @param parser The parser to be converted optional.
 */
export function optionalRef<T, S>(parser: Parser<T, S>): Parser<T | null, S> {
    return or(parser, toParser(null))
}

/**
 * Check that the given parser succeeds without consuming any input. Corresponds 
 * to the & operator in PEG grammars.
 * @param parser The parser that should match the input.
 */
export function and<T, S>(parser: Parser<T, S>): Parser<T, S> {
    return input => {
        let pos = input.position
        let res = parser(input)
        input.position = pos
        return res
    }
}

/**
 * Check that the given parser fails without consuming any input. Corresponds 
 * to the ! operator in PEG grammars.
 * @param parser The parser which should not match the input.
 */
export function not<T, S>(parser: Parser<T, S>): Parser<T, S> {
    return input => {
        let pos = input.position
        let res = parser(input)
        input.position = pos
        if (res.success) {
            let found = `${res.result}`
            return failed(input.position, found, ["not " + found])
        }
        return succeeded(input.position, <T><unknown>undefined)
    }
}

/**
 * Any of the given parsers must succeed. The operation is the same 
 * as the "or" combinator generalized to arbitrary number of choices.
 * @param parsers The list of parser to be tried.
 */
export function any<T, S>(...parsers: Parser<T, S>[]): Parser<T, S> {
    if (parsers.length == 0)
        throw Error("At least one parser must be given.")
    return input => {
        let res: ParseResult<T>
        let i = 0
        do {
            res = parsers[i++](input)
        }
        while (i < parsers.length && !res.success)
        return res
    }
}

/** 
 * Peek next symbol in the input stream without changing the position.
 */
export function peek<S>(): Parser<S, S> {
    return input => {
        let pos = input.position
        let next = input.next()
        input.position = pos
        return next.done ?
            failed(input.position, "end of input") :
            succeeded(input.position, next.value)
    }
}

/**
 * Select a parser to be used based on the next symbol in the input. This function
 * is an alternative to the the "any" combinator. It reduces backtracking when the
 * parser to be applied can be deduced from the next symbol.
 * @param selector The function which returns the parser to be applied.
 */
export function choose<T, S>(selector: (input: S) => Parser<T, S>): Parser<T, S> {
    return bind(peek<S>(), selector)
}

/**
 * A parser that returns the current position of the input. This is useful
 * when binding parsers together and you want to know the position where you
 * currently are. The position can be also used for backtracking.
 */
export function position<S>(): Parser<number, S> {
    return input => succeeded(input.position, input.position)
}

/**
 * Perform explicit backtracking, that is, move the input position to a specified
 * place, and try to run the given parser there. After parsing the position is 
 * resetted back to its original value. This operation is needed rarely but it
 * is handy in situations where the parsing is context-sensitive and it is not 
 * feasible to store the context in the satellite state.
 * @param parser The parser to be run in the specified position.
 * @param position The position where to backtrack.
 */
export function backtrack<T, S>(parser: Parser<T, S>, position: number): Parser<T, S> {
    return input => {
        let pos = input.position
        input.position = position
        let res = parser(input)
        input.position = pos
        return res
    }
}

/**
 * Attach debugging information to a parser. To trace which rules are triggered 
 * during parsing, you can add debugging info to any parser. This combinator
 * produces a hierarchical tree of parser invocations which includes information 
 * about input symbol and its position. If debugging is disabled, this function 
 * does nothing.
 * @param parser The parser to be decorated with debug info.
 * @param ruleName The name of the parsing rule.
 */
export function trace<T, S>(parser: Parser<T, S>, ruleName: string): Parser<T, S> {
    if (!parserDebug.debugging)
        return parser;
    return input => {
        parserDebug.write(`${ruleName} called with input '${input.current}' ` +
            `at position ${input.position}`)
        parserDebug.indent()
        let res = parser(input)
        parserDebug.rulesEvaluated++
        parserDebug.unindent()
        parserDebug.write(`${ruleName} ${res.success ? "SUCCEEDED" : "FAILED"} ` +
            `at position ${input.position}`)
        return res
    }
}

/**
 * Get the current satellite state stored in the input.
 */
export function getState<T, S>(): Parser<T, S> {
    return input => succeeded(input.position, <T>input.state)
}

/**
 * Set the current satellite state stored in the input.
 * @param newValue The function that returns the new state.
 */
export function setState<T, S>(newValue: () => T): Parser<T, S> {
    return input => succeeded(input.position, input.state = newValue())
}

/**
 * Mutate the satellite state stored in the input.
 * @param mutate The function that mutates the state. It gets the current
 * state as a parameter.
 */
export function mutateState<T, S>(mutate: (state: T) => void): Parser<T, S> {
    return input => {
        mutate(input.state)
        return succeeded(input.position, input.state)
    }
}

/**
 * Check that the current state matches a predicate. If not, the result parser 
 * fails.
 * @param predicate The predicate that gets current state as input. It should
 * return true for parsing to continue, and false to fail the parser.
 */
export function checkState<T, S>(predicate: (state: T) => boolean): Parser<T, S> {
    return input => predicate(input.state) ?
        succeeded(input.position, input.state) :
        failed(input.position, "Matching predicate.")
}

/**
 * Clean up the current state after a parser has been executed. The clean-up function
 * is run regardless of whether the parser succeeds or fails.
 * @param parser The parser to be executed.
 * @param cleanup The function that cleans up the state after the parser has run.
 */
export function cleanupState<T, U, S>(parser: Parser<T, S>, cleanup: (state: U) => void):
    Parser<T, S> {
    return input => {
        let res = parser(input)
        cleanup(input.state)
        return res
    }
}

/**
 * The catch-all parser that will match any symbol read from the input.
 */
export function anything<T>(): Parser<T, T> {
    return satisfy<T>(_ => true)
}

/**
 * Parser that succeeds if the symbol read from the input is equal (===) to
 * given parameter; otherwise parsing fails.
 * @param value The value expected to be read from the input.
 */
export function is<T>(value: T) {
    return satisfy<T>(x => x === value)
}