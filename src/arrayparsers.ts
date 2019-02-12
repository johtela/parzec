/**
 * @module arrayparsers
 * 
 * Combinators for Parsing Arrays and Expressions
 * ==============================================
 * This module contains additional combinators that are useful when parsing 
 * sequences or expressions. They are adapted from the original 
 * [Parsec](http://hackage.haskell.org/package/parsec-3.1.13.0/docs/Text-Parsec-Combinator.html)
 * library.
 */
import { Parser, bind, seq, mret, zeroOrMore, or, map, any } from "./parser"

/**
 * Type definition for a binary function that has the same domain and range type.
 */
export type BinaryOperation<T> = (x: T, y: T) => T

/**
 * Parse an array containing at least one element. The items of the array are recognized by 
 * `parser`. The items are separated by input recognized by `separator`. The function returns
 * an array of parsed elements.
 */
export function oneOrMoreSeparatedBy<T, U, S>(parser: Parser<T, S>, separator: Parser<U, S>):
    Parser<T[], S> {
    return  bind(parser, x =>
            bind(zeroOrMore(seq(separator, parser)), xs =>
            mret([x].concat(xs))))
}

/**
 * Parse a potentially empty array. The items of the array are recognized by 
 * `parser`. The items are separated by input recognized by `separator`.
 */
export function zeroOrMoreSeparatedBy<T, U, S>(parser: Parser<T, S>, separator: Parser<U, S>):
    Parser<T[], S> {
    return or(oneOrMoreSeparatedBy(parser, separator), mret([]))
}

/**
 * Parse item(s) followed by a terminator given in the `after` parser. The result of
 * `parser` is returned, and result of `after` is ignored.
 */
export function followedBy<T, U, S>(parser: Parser<T, S>, after: Parser<U, S>): 
    Parser<T, S> {
    return  bind(parser, p =>
            bind(after, a =>
            mret(p)))
}

/**
 * Parse item(s) surrounded by input recognized by the `surround` parser. The result
 * of `parser` is returned.
 */
export function surroundedBy<T, U, S>(parser: Parser<T, S>, surround: Parser<U, S>): 
    Parser<T, S> {
    return  bind(surround, o =>
            bind(parser, p =>
            bind(surround, c =>
            mret(p))))
}

/**
 * Parse item(s) surrounded by an open and closing bracket. The result `parser` is returned.
 */
export function bracketedBy<T, U, V, S>(parser: Parser<T, S>, open: Parser<U, S>,
    close: Parser<V, S>): Parser<T, S> {
    return  bind(open, o =>
            bind(parser, p =>
            bind(close, c =>
            mret(p))))
}

/**
 * Parse one or more occurrences of `parser`, separated by `operation`. 
 * Return a value obtained by a left associative application of all functions returned 
 * by `operation` to the values returned by `parser`. This parser can for example be used 
 * to eliminate left recursion which typically occurs in expression grammars.
 */
export function chainOneOrMore<T, S>(parser: Parser<T, S>, 
    operation: Parser<BinaryOperation<T>, S>): Parser<T, S> {
    return  bind(parser, x =>
            bind(zeroOrMore(
                bind(operation, f =>
                bind(parser, y =>
                mret(<[BinaryOperation<T>, T]>[f, y])))), fys =>
            mret(fys.reduce((z, [f, y]) => f(z, y), x))))
}

/**
 * Parse zero or more occurrences of `parser`, separated by `operation`. 
 * Return a value obtained by a left associative application of all functions returned 
 * by `operation` to the values returned by `parser`. If there are zero occurrences of 
 * `parser`, the `value` is returned.
 */
export function chainZeroOrMore<T, S>(parser: Parser<T, S>, 
    operation: Parser<BinaryOperation<T>, S>, value: T): Parser<T, S> {
    return or(chainOneOrMore(parser, operation), mret(value))
}

/**
 * Construct a parser for operator selection. Used typically in conjunction
 * with `chain*` functions.
 */
export function operators<T, U, S>(...ops: [Parser<T, S>, U][]): Parser<U, S> {
    return any(...ops.map(([p, o]) => map(p, _ => o)))
}