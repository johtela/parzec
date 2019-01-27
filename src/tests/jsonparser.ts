import { ParserInput } from "../parserinput";
import { Token, Lexer, lexerInput } from "../lexer";
import { Parser, mret, bind, map, where, optional, token, or, oneOrMore, seq, mapTokenText } from "../parser";
import { Ref } from "../ref";

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

const digit = mapTokenText(token(JsonToken.Digit))
const onenine = where(digit, d => d != "0")
const digits = map(oneOrMore(digit), ss => ss.join())
const oneninedigits = 
    bind(onenine, d => 
    bind(digits, ds => 
    mret(d + ds)))
const minus = mapTokenText(token(JsonToken.Minus))
const int = 
    bind(optional(minus, ""), minus => 
    bind(or(digit, oneninedigits), num =>
    mret(minus + num)))
const frac = optional(
    map(
        seq(token(JsonToken.Point), digits), 
        ds => "." + ds), 
    "")
const sign = optional(
    mapTokenText(
        or(token(JsonToken.Plus), token(JsonToken.Minus))),  
    "")
const exp = optional(
    bind(token(JsonToken.Exp), e =>
    bind(sign, s =>
    bind(digits, ds =>
    mret(e.text + s + ds)))),
    "")
const number = 
    bind(int, i =>
    bind(frac, f =>
    bind(exp, e =>
    mret(Number(i + f + e)))))
const string = mapTokenText(token(JsonToken.String))
const whitespace = mapTokenText(token(JsonToken.Whitespace))
const element = new Ref<Parser<any, Token<JsonToken>>>()