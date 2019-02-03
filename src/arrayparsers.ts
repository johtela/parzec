import { Parser, bind, seq, mret, zeroOrMore, or, map, any } from "./parser";

type BinaryOperation<T> = (x: T, y: T) => T

export function oneOrMoreSeparatedBy<T, U, S>(parser: Parser<T, S>, separator: Parser<U, S>):
    Parser<T[], S> {
    return  bind(parser, x =>
            bind(zeroOrMore(seq(separator, parser)), xs =>
            mret([x].concat(xs))))
}

export function zeroOrMoreSeparatedBy<T, U, S>(parser: Parser<T, S>, separator: Parser<U, S>):
    Parser<T[], S> {
    return or(oneOrMoreSeparatedBy(parser, separator), mret([]))
}

export function followedBy<T, U, S>(parser: Parser<T, S>, after: Parser<U, S>): 
    Parser<T, S> {
    return  bind(parser, p =>
            bind(after, a =>
            mret(p)))
}

export function surroundedBy<T, U, S>(parser: Parser<T, S>, surround: Parser<U, S>): 
    Parser<T, S> {
    return  bind(surround, o =>
            bind(parser, p =>
            bind(surround, c =>
            mret(p))))
}

export function bracketedBy<T, U, V, S>(parser: Parser<T, S>, open: Parser<U, S>,
    close: Parser<V, S>): Parser<T, S> {
    return  bind(open, o =>
            bind(parser, p =>
            bind(close, c =>
            mret(p))))
}

export function chainOneOrMore<T, S>(parser: Parser<T, S>, 
    operation: Parser<BinaryOperation<T>, S>): Parser<T, S> {
    return  bind(parser, x =>
            bind(zeroOrMore(
                bind(operation, f =>
                bind(parser, y =>
                mret(<[BinaryOperation<T>, T]>[f, y])))), fys =>
            mret(fys.reduce((z, [f, y]) => f(z, y), x))))
}

export function chainZeroOrMore<T, S>(parser: Parser<T, S>, 
    operation: Parser<BinaryOperation<T>, S>, value: T): Parser<T, S> {
    return or(chainOneOrMore(parser, operation), mret(value))
}

export function operators<T, U, S>(...ops: [Parser<T, S>, U][]): Parser<U, S> {
    return any(...ops.map(([p, o]) => map(p, _ => o)))
}