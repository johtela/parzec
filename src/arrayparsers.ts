/**
 * # Combinators for Parsing Arrays and Expressions
 * 
 * This module contains additional combinators that are useful when parsing 
 * sequences or expressions. They are adapted from the original 
 * [Parsec](http://hackage.haskell.org/package/parsec-3.1.13.0/docs/Text-Parsec-Combinator.html)
 * library.
 */
import * as par from "./parser"
/**
 * We use a trick described 
 * [here](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)
 * to add the functions we define to the `Parser<T, S>` class.
 */
declare module './parser' {
    export interface Parser<T, S> {
        oneOrMoreSeparatedBy<U>(separator: Parser<U, S>): Parser<T[], S>
        zeroOrMoreSeparatedBy<U>(separator: Parser<U, S>): Parser<T[], S>
        followedBy<U>(after: Parser<U, S>): Parser<T, S>
        surroundedBy<U>(surround: Parser<U, S>): Parser<T, S>
        bracketedBy<U, V>(open: Parser<U, S>, close: Parser<V, S>): Parser<T, S>
        chainOneOrMore(operation: Parser<BinaryOp<T>, S>): Parser<T, S>
        chainZeroOrMore(operation: Parser<BinaryOp<T>, S>, value: T):
            Parser<T, S>
    }
}
/**
 * Type definition for a binary function that has the same domain and range 
 * type.
 */
export type BinaryOp<T> = (x: T, y: T) => T
/**
 * ## Parsing Separated Lists
 * 
 * Parse an array containing at least one element. The items of the array are 
 * recognized by `parser`. The items are separated by input recognized by 
 * `separator`. The function returns an array of parsed elements.
 */
par.Parser.prototype.oneOrMoreSeparatedBy = function<T, U, S>(
    this: par.Parser<T, S>, separator: par.Parser<U, S>): par.Parser<T[], S> {
    return this.bind(
        x => separator.seq(this).zeroOrMore().bind(
        xs => par.mret([x].concat(xs))))
}
/**
 * Parse a potentially empty array. The items of the array are recognized by 
 * `parser`. The items are separated by input recognized by `separator`.
 */
par.Parser.prototype.zeroOrMoreSeparatedBy = function<T, U, S>(
    this: par.Parser<T, S>, separator: par.Parser<U, S>): par.Parser<T[], S> {
    return this.oneOrMoreSeparatedBy(separator).or(par.mret([]))
}
/**
 * ## Terminators & Brackets
 * 
 * Parse item(s) followed by a terminator given in the `after` parser. The 
 * result of `parser` is returned, and result of `after` is ignored.
 */
par.Parser.prototype.followedBy = function<T, U, S>(this: par.Parser<T, S>,
    after: par.Parser<U, S>): par.Parser<T, S> {
    return this.bind(p => after.bind(_ => par.mret(p)))
}
/**
 * Parse item(s) surrounded by input recognized by the `surround` parser. The 
 * result of `parser` is returned.
 */
par.Parser.prototype.surroundedBy = function<T, U, S>(this: par.Parser<T, S>,
    surround: par.Parser<U, S>): par.Parser<T, S> {
    return surround.bind(
        o => this.bind(
        p => surround.bind(
        c => par.mret(p))))
}
/**
 * Parse item(s) surrounded by an open and closing bracket. The result `parser` 
 * is returned.
 */
par.Parser.prototype.bracketedBy = function<T, U, V, S>(this: par.Parser<T, S>,
    open: par.Parser<U, S>, close: par.Parser<V, S>): par.Parser<T, S> {
    return open.bind(
        o => this.bind(
        p => close.bind(
        c => par.mret(p))))
}
/**
 * ## Parsing Expressions
 * 
 * Parse one or more occurrences of `parser`, separated by `operation`. 
 * Return a value obtained by a left associative application of all functions 
 * returned by `operation` to the values returned by `parser`. This parser can 
 * for example be used to eliminate left recursion which typically occurs in 
 * expression grammars.
 */
par.Parser.prototype.chainOneOrMore = function<T, S>(this: par.Parser<T, S>,
    operation: par.Parser<BinaryOp<T>, S>): par.Parser<T, S> {
    return this.bind(
        x => operation.bind(
            f => this.bind(
            y => par.mret([f, y] as [BinaryOp<T>, T]))).zeroOrMore().bind(
        fys => par.mret(fys.reduce((z, [f, y]) => f(z, y), x))))
}
/**
 * Parse zero or more occurrences of `parser`, separated by `operation`. 
 * Return a value obtained by a left associative application of all functions 
 * returned by `operation` to the values returned by `parser`. If there are 
 * zero occurrences of `parser`, the `value` is returned.
 */
par.Parser.prototype.chainZeroOrMore = function<T, S>(this: par.Parser<T, S>,
    operation: par.Parser<BinaryOp<T>, S>, value: T): par.Parser<T, S> {
    return this.chainOneOrMore(operation).or(par.mret(value))
}
/**
 * Construct a parser for operator selection. Used typically in conjunction
 * with `chain*` functions.
 */
export function operators<T, U, S>(...ops: [par.Parser<T, S>, U][]): 
    par.Parser<U, S> {
    return par.any(...ops.map(([p, o]) => p.map(_ => o)))
}