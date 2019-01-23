import { ParserInput } from "./parser-input"
import { ParseResult, succeeded, failed } from "./parse-result";

export type Parser<T, S> = (input: ParserInput<S>) => ParseResult<T>

export var parserSettings = {
    debugging: false,
    errorMessages: true,
    rulesEvaluated: 0
}

export function tryParse<T, S>(parser: Parser<T, S>, input: ParserInput<S>): 
    ParseResult<T> {
    parserSettings.rulesEvaluated = 0
    let res = parser(input)
    if (parserSettings.debugging)
        console.info("Number of rules evaluated: " + parserSettings.rulesEvaluated)
    return res
}

export function parse<T, S>(parser: Parser<T, S>, input: ParserInput<S>): T {
    var res = tryParse(parser, input)
    if(!res.success)
        throw Error(`Parse error at ${res.position}.\n
            Found: "${res.found}"\n 
            Expected: "${res.expected.reduce((s1, s2) => s1 + ", " + s2)}"`)
    return res.result
}