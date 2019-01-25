import { Parser, expect, satisfy, anything, is } from "./parser";

export const anyString = anything<string>()

export function literal(x: string): Parser<string, string> {
    return expect(is(x), x)
}

export function literalCI(x: string): Parser<string, string> {
    let lower = x.toLowerCase()
    return expect(satisfy(y => lower === y.toLowerCase()), `${x} (case-insensitive)`)
}

export const number = expect(satisfy<string>(x => !isNaN(<any>x)), "number")

export const lowerCase = expect(satisfy<string>(x => x === x.toLowerCase()),
    "lowercase characters")

export const upperCase = expect(satisfy<string>(x => x === x.toUpperCase()),
    "uppercase characters")

export const letters = expect(satisfy<string>(
    x => x.toLowerCase() != x.toUpperCase()), "letters")

