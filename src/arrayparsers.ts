import { Parser, bind, seq, mret, zeroOrMore, or } from "./parser";

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

export function bracket<T, U, V, S>(parser: Parser<T, S>, open: Parser<U, S>,
    close: Parser<V, S>): Parser<T, S> {
    return  bind(open, o =>
            bind(parser, p =>
            bind(close, c =>
            mret(p))))
}

export function reduceOneOrMore<T, S>(parser: Parser<T, S>, 
    operation: Parser<BinaryOperation<T>, S>): Parser<T, S> {
    return  bind(parser, x =>
            bind(zeroOrMore(
                bind(operation, f =>
                bind(parser, y =>
                mret(<[BinaryOperation<T>, T]>[f, y])))), fys =>
            mret(fys.reduce((z, [f, y]) => f(z, y), x))))
}

export function reduceZeroOrMore<T, S>(parser: Parser<T, S>, 
    operation: Parser<BinaryOperation<T>, S>, value: T): Parser<T, S> {
    return or(reduceOneOrMore(parser, operation), mret(value))
}
