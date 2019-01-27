import { ParserInput } from "../parserinput";
import { Token, Lexer, lexerInput, mapText } from "../lexer";
import { bind, map, where, optional, token, or, oneOrMore, toParser } from "../parser";

export enum JsonToken {
    True, False, Null, LeftBrace, RightBrace, LeftBracket, RightBracket, Comma, Colon,
    Digit, Point, Exp, Plus, Minus, String, Whitespace 
}

const lexer = new Lexer<JsonToken>(
    [/true/, JsonToken.True],
    [/false/, JsonToken.False],
    [/null/, JsonToken.Null],
    [/\{/, JsonToken.LeftBrace],
    [/\}/, JsonToken.RightBrace],
    [/\[/, JsonToken.LeftBracket],
    [/\]/, JsonToken.RightBracket],
    [/\,/, JsonToken.Comma],
    [/\:/, JsonToken.Colon],
    [/\d/, JsonToken.Digit],
    [/\./, JsonToken.Point],
    [/[eE]/, JsonToken.Exp],
    [/\+/, JsonToken.Plus ],
    [/\-/, JsonToken.Minus ],
    [/\"(?:(?![\"\\])[\u{0020}-\u{10ffff}])|(?:\\(?:[\"\\\/bnrt]|(?:u[0-9a-fA-F]{4})))*\"/, JsonToken.String],
    [/[\t\n\r ]+/, JsonToken.Whitespace ]);

export function jsonInput(text: string): ParserInput<Token<JsonToken>> {
    return lexerInput<JsonToken>(text, lexer);
}

const digit = map(token(JsonToken.Digit), mapText)
const onenine = where(digit, d => d != "0")
const digits = map(oneOrMore(digit), ss => ss.join())
const oneninedigits = 
    bind(onenine, d => 
    bind(digits, ds => 
    toParser(d + ds)))
const minus = map(token(JsonToken.Minus), mapText)
const int = 
    bind(optional(minus, ""), minus => 
    bind(or(digit, oneninedigits), num =>
    toParser(minus + num)))
