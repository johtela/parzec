/**
 * Parser Monad and Basic Combinators
 * =====================================
 * This module defines the basic types and combinators for the parser monad. 
 * To learn about monadic parsers refer to the list of literature in the 
 * [Wikipedia page](https://en.wikipedia.org/wiki/Parser_combinator).
 */
import { ParserInput } from "./input"
import { ParseResult, succeeded, failed, expectedAsCsv, joinExpected }
    from "./result"
import { Token } from "./lexer"
import { Ref } from "./ref"
import { escapeWhitespace } from "./utils"
import { ParseError, ErrorSource } from "./error"

/**
 * Parsing Function
 * ----------------
 * `Parse<T, S>` type represents a parsing function whics takes a 
 * `ParserInput<S>` stream as an argument and returns a `ParseResult<T>` object. 
 * The type of value to be parsed and the type of terminals in the input stream 
 * are given as type parameters `T` and `S`.
 */
export type Parse<T, S> = (input: ParserInput<S>) => ParseResult<T>
/**
 * Parser Class
 * ------------
 * The central type in the Parzec library is the `Parser<T, S>` class. It wraps
 * a parsing function and provides the core combinators to combine parsers in 
 * various ways.
 */
export class Parser<T, S> {
    /**
     * Constructor wraps the parsing function.
     */
    constructor(readonly parse: Parse<T, S>) { }
    /**
     * The monadic bind that corresponds to Haskell's `>>=` operator. Runs 
     * `this` parser, and if it succeeds, feeds its result to the `binder` 
     * function that returns a new Parser. This is the basic operation that is 
     * used in other combinators to glue parsers together.
     */
    bind<U>(binder: (value: T) => Parser<U, S>): Parser<U, S> {
        return new Parser(input => {
            let pos = input.position
            let res1 = this.parse(input)
            if (res1.kind == "ok") {
                let res2 = binder(res1.result).parse(input)
                if (res2.kind == "fail" && pos !== input.position)
                    input.position = pos // backtrack
                return res2
            }
            return res1
        })
    }
    /**
     * The sequence operator. Runs `this` parser, and if it succeeds, runs the 
     * `other` parser ignoring the result of `this` one.
     */
    seq<U>(other: Parser<U, S>): Parser<U, S> {
        return this.bind(_ => other)
    }
    /**
     * Map result of the parser to another value. This function implements a 
     * [_functor_](https://en.wikipedia.org/wiki/Functor) which is a superclass 
     * of monad.
     */
    map<U>(mapper: (value: T) => U): Parser<U, S> {
        return this.bind(x => mret(mapper(x))) as Parser<U, S>
    }
    /**
     * Conditional Parsing
     * -------------------
     * The ordered choice operation. Creates a parser that first runs `this` 
     * parser, and if that fails, runs the `other` one. Corresponds to the `/` 
     * operation in [PEG grammars](https://en.wikipedia.org/wiki/Parsing_expression_grammar).
     */
    or<U>(other: Parser<U, S>): Parser<T | U, S> {
        return new Parser(input => {
            let pos = input.position;
            let res1 = this.parse(input) as ParseResult<T | U>
            if (res1.kind == "ok")
                return res1
            if (res1.position > pos)
                return res1
            let res2 = other.parse(input)
            if (res2.kind == "ok")
                return res2
            joinExpected(res2, res1)
            return res2
        })
    }
    /**
     * Parse an optional value, if the parser fails then the default value is 
     * returned.
     */
    optional(defaultValue: T): Parser<T, S> {
        return this.or(mret(defaultValue))
    }
    /**
     * Parse an optional reference value, if the parser fails then null is 
     * returned.
     */
    optionalRef(): Parser<T | null, S> {
        return this.or(mret(null))
    }
    /**
     * Runs parser and checks that it succeeds and that the result it returns
     * satisfies a given predicate.
     */
    where(predicate: (value: T) => boolean): Parser<T, S> {
        return this.bind(x =>
            predicate(x) ? mret(x) : fail(`${x}`, "predicate"))
    }
    /**
     * Parsing Multiple Items
     * ----------------------
     * Creates a parser that will run `this` parser zero or more times. The 
     * results of the input parser are added to an array.
     */
    zeroOrMore(): Parser<T[], S> {
        return new Parser(input => {
            let list: T[] = []
            while (true) {
                let pos = input.position
                let res = this.parse(input)
                if (res.kind == "fail")
                    return res.position > pos ?
                        res : succeeded(res.position, list)
                list.push(res.result)
            }
        })
    }
    /**
     * Creates a parser that runs `this` parser one or more times.
     */
    oneOrMore(): Parser<T[], S> {
        return new Parser(input => {
            let res = this.parse(input)
            if (res.kind == "fail")
                return res
            let list = [res.result]
            while (true) {
                let pos = input.position
                res = this.parse(input)
                if (res.kind == "fail")
                    return res.position > pos ? res : succeeded(res.position, list)
                list.push(res.result)
            }
        })
    }
    /**
     * Parsing succeeds if `this` parser succeeds from `min` to `max` times.
     */
    occurrences(min: number, max: number): Parser<T[], S> {
        return this.zeroOrMore().bind(list => {
            let cnt = list.length
            return cnt >= min && cnt <= max ?
                mret(list) :
                fail(`${cnt} occurrences`, `${min}-${max} occurrences`)
        })
    }
    /**
     * Lookahead & Backtracking
     * ------------------------
     * Check that `this` parser succeeds without consuming any input. 
     * Corresponds to the `&` operator in PEG grammars.
     */
    and(): Parser<T, S> {
        return new Parser(input => {
            let pos = input.position
            let res = this.parse(input)
            input.position = pos
            return res
        })
    }
    /**
     * Check that `this` parser fails without consuming any input. Corresponds 
     * to the `!` operator in PEG grammars.
     */
    not(): Parser<T, S> {
        return new Parser(input => {
            let pos = input.position
            let res = this.parse(input)
            input.position = pos
            if (res.kind == "ok") {
                let found = `${res.result}`
                return failed(res.position, found, ["not " + found])
            }
            return succeeded(res.position, <T><unknown>undefined)
        })
    }
    /**
     * Bactrack to the current input position, even if the given parser fails
     * and has advanced the input position. Normally we do not bactrack when a
     * parser has advanced in the input. Doing so would loose the position where
     * the parsing failed and make error messages more vague. Sometimes, 
     * however, we need more input lookahead. In these cases, you can use the 
     * backtrack operation to retry the next rule.
     */
    backtrack(): Parser<T, S> {
        return new Parser(input => {
            let pos = input.position
            let res = this.parse(input)
            if (res.kind == "fail" && res.position > pos)
                res.position = pos
            return res
        })
    }
    /**
     * Error Reporting and Debugging
     * -----------------------------
     * Give a human-readable name to the "thing" that the given parser matches. 
     * This name is reported as expected value, if the parsing fails.
     */
    expect(expected: string): Parser<T, S> {
        if (!parserDebug.errorMessages)
            return this
        let resParser = new Parser((input: ParserInput<S>) => {
            let res = this.parse(input)
            if (res.kind == "fail")
                res.expected.push(expected)
            return res
        })
        return parserDebug.debugging ? resParser.trace(expected) : resParser
    }
    /**
     * Attach debugging information to a parser. To trace which rules are 
     * triggered during parsing, you can add debugging info to any parser. This 
     * combinator produces a hierarchical tree of parser invocations which 
     * includes information about input symbol and its position. If debugging 
     * is disabled, this function does nothing.
     */
    trace(ruleName: string): Parser<T, S> {
        if (!parserDebug.debugging)
            return this;
        return new Parser(input => {
            parserDebug.write(`${ruleName} called with input '${input.current}'.`)
            parserDebug.indent()
            let res = this.parse(input)
            parserDebug.rulesEvaluated++
            parserDebug.unindent()
            parserDebug.write((res.kind == "ok" ?
                `${ruleName} SUCCEEDED with value '${escapeWhitespace(`${res.result}`)}'` :
                `${ruleName} FAILED with value '${escapeWhitespace(`${res.found}`)
                    }'. Expected values: ${expectedAsCsv(res)}`) +
                ` at position ${res.position}`)
            return res
        })
    }
}
/**
 * Debugging Options
 * -----------------
 * The following object contains the global settings that control the parser 
 * reporting. 
 */
export const parserDebug = {
    /** 
     * When `debugging` flag is on parsers count the number of rules evaluated 
     * during their operation. The `rulesEvaluated` field contains this 
     * information. 
     */
    debugging: false,
    rulesEvaluated: 0,
    /**
     * If errorMessages flag is turned off, the expected information will not be 
     * available in parse errors. This speeds up the parsing nominally.
     */
    errorMessages: true,
    /**
     * The current indentation level in the debugging output is stored in this 
     * field.
     */
    indentation: 0,
    /**
     * Indent the debug output by one level.
     */
    indent() {
        this.indentation++
    },
    /**
     * Unndent the debug output by one level.
     */
    unindent() {
        this.indentation--
    },
    /**
     * Write a string to the debug output.
     */
    write(text: string) {
        let tabs = "  ".repeat(this.indentation)
        console.log(tabs + text)
    }
}

/**
 * Main Functions
 * --------------
 * Attempt to parse an input with a given parser. Takes a Parser and a 
 * ParserInput as arguments and return a ParseResult.
 */
export function tryParse<T, S>(parser: Parser<T, S>, input: ParserInput<S>):
    ParseResult<T> {
    parserDebug.rulesEvaluated = 0
    let res = parser.parse(input)
    if (parserDebug.debugging)
        console.info("Number of rules evaluated: " + parserDebug.rulesEvaluated)
    return res
}
/**
 * Parse an input using a given parser, or throw an exception, if parsing fails.
 */
export function parse<T, S>(parser: Parser<T, S>, input: ParserInput<S>): T {
    var res = tryParse(parser, input)
    if (res.kind == "fail")
        throw new ParseError(ErrorSource.Parser, res.position, res.found,
            res.expected)
    return res.result
}
/**
 * Monadic Returns
 * ---------------
 * Create a parser that always succeeds and returns the given value without 
 * consuming any input. This function implements the monadic return, that is, 
 * it lifts a value to the parser monad.
 */
export function mret<T, S>(value: T): Parser<T, S> {
    return new Parser(input => succeeded(input.position, value))
}
/**
 * Create a parser that always fails. The terminals reported as
 * found or expected are given as an argument.
 */
export function fail<T, S>(found: string, ...expected: string[]): Parser<T, S> {
    return new Parser(input => failed(input.position, found, expected))
}
/**
 * Parsing Terminals
 * -----------------
 * Creates a parser that reads one terminal from the input and returns it, if it 
 * satisfies the given predicate; otherwise the parser fails.
 */
export function satisfy<T>(predicate: (value: T) => boolean): Parser<T, T> {
    return new Parser(input => {
        let pos = input.position
        let next = input.next()
        if (next.done)
            return failed(input.position, "end of input")
        let item = next.value
        if (predicate(item))
            return succeeded(input.position, item)
        input.position = pos
        return failed<T>(input.position, `${item}`)
    })
}
/**
 * Creates a parser that reads one terminal from the input and returns it, if it
 * does **not** satisfy a given predicate.
 */
export function notSatisfy<T>(predicate: (value: T) => boolean): Parser<T, T> {
    return satisfy(x => !predicate(x))
}
/**
 * Any of the given parsers must succeed. The operation is the same 
 * as the `or` combinator generalized to arbitrary number of choices.
 */
export function any<T, S>(...parsers: Parser<T, S>[]): Parser<T, S> {
    if (parsers.length == 0)
        throw Error("At least one parser must be given.")
    return new Parser(input => {
        let res: ParseResult<T> | null = null
        let i = 0
        let pos = input.position
        do {
            let r = parsers[i++].parse(input)
            if (r.kind == "ok")
                return r
            if (r.position > pos)
                return r
            if (res == null)
                res = r
            else
                joinExpected(res, r)
        }
        while (i < parsers.length)
        return res
    })
}
/** 
 * Peek next symbol in the input stream without changing the position.
 */
export function peek<S>(): Parser<S, S> {
    return new Parser(input => {
        let pos = input.position
        let next = input.next()
        input.position = pos
        return next.done ?
            failed(input.position, "end of input") :
            succeeded(input.position, next.value)
    })
}
/**
 * Select a parser to be used based on the next symbol in the input. This 
 * function is an alternative to the the "any" combinator. It reduces 
 * backtracking when the parser to be applied can be deduced from the next 
 * symbol.
 */
export function choose<T, S>(selector: (input: S) => Parser<T, S>):
    Parser<T, S> {
    return peek<S>().bind(selector)
}
/**
 * Getting Current Position
 * ------------------------
 * A parser that returns the current position of the input. This is useful
 * when binding parsers together and you want to know the position where you
 * currently are. The position can be also used for backtracking.
 */
export function position<S>(): Parser<number, S> {
    return new Parser(input => succeeded(input.position, input.position))
}
/**
 * User-Managed State
 * ------------------
 * Get the current satellite state stored in the input.
 */
export function getState<T, S>(): Parser<T, S> {
    return new Parser(input => succeeded(input.position, <T>input.state))
}
/**
 * Set the current satellite state stored in the input. The new state
 * is not given explicitly. Rather, a funcion which returns the new
 * state is specified.
 */
export function setState<T, S>(newValue: () => T): Parser<T, S> {
    return new Parser(input =>
        succeeded(input.position, input.state = newValue()))
}
/**
 * Mutate the satellite state stored in the input. The mutation is done
 * with a function given as an argument. 
 */
export function mutateState<T, S>(mutate: (state: T) => void): Parser<T, S> {
    return new Parser(input => {
        mutate(input.state)
        return succeeded(input.position, input.state)
    })
}
/**
 * Check that the current state matches a predicate. If not, the result parser 
 * fails.
 */
export function checkState<T, S>(predicate: (state: T) => boolean): 
    Parser<T, S> {
    return new Parser(input => predicate(input.state) ?
        succeeded(input.position, input.state) :
        failed(input.position, "Matching predicate."))
}
/**
 * Clean up the current state after a parser has been executed. The clean-up function
 * is run regardless of whether the parser succeeds or fails.
 */
export function cleanupState<T, U, S>(parser: Parser<T, S>,
    cleanup: (state: U) => void): Parser<T, S> {
    return new Parser(input => {
        let res = parser.parse(input)
        cleanup(input.state)
        return res
    })
}
/**
 * Defining Mutually Recursive Parsers
 * -----------------------------------
 * Often grammar rules are mutually recursive, which means that there is no way 
 * to write them in an order where all the dependent rules are defined. In these 
 * occasions, you can just create a _reference_ to a parser and set its 
 * implementation later. To refer to the parser that is not yet defined, you can 
 * use this function. 
 */
export function forwardRef<T, S>(parser: Ref<Parser<T, S>>): Parser<T, S> {
    return new Parser(input => parser.target.parse(input))
}
/**
 * General Parsers
 * ---------------
 * The catch-all parser that will match any symbol read from the input.
 */
export function anything<T>(): Parser<T, T> {
    return satisfy<T>(_ => true)
}
/**
 * Parser that succeeds if the symbol read from the input is equal (===) to
 * given parameter; otherwise parsing fails.
 */
export function is<T>(value: T): Parser<T, T> {
    return satisfy<T>(x => x === value)
}
/**
 * Parse a specific token from the lexer input stream.
 */
export function token<T>(token: T): Parser<Token<T>, Token<T>> {
    return satisfy<Token<T>>(t => t.token === token)
}