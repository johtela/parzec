import { ParserInput } from "../parserinput";
import { Token, Lexer, lexerInput } from "../lexer";
import { Parser, expect, map, token, optional, bind, forwardRef, or, mret, any, parse, 
    trace, parserDebug, choose } from "../parser";
import { oneOrMoreSeparatedBy, bracket } from "../arrayparsers";
import { initObject } from "../utils";
import { Ref } from "../ref";

// Tokens
export enum JsonToken {
    True, False, Null, LeftBrace, RightBrace, LeftBracket, RightBracket, Comma, Colon,
    Digit, Point, Exp, Plus, Minus, Number, String, Whitespace, Unknown
}

parserDebug.debugging = false

const lexer = new Lexer<JsonToken>(
    [/true/, JsonToken.True],
    [/false/, JsonToken.False],
    [/null/, JsonToken.Null],
    [/\{/, JsonToken.LeftBrace],
    [/\}/, JsonToken.RightBrace],
    [/\[/, JsonToken.LeftBracket],
    [/\]/, JsonToken.RightBracket],
    [/,/, JsonToken.Comma],
    [/:/, JsonToken.Colon],
    [/-?(?:[1-9]\d+|\d(?!\d))(?:\.\d+)?(?:[eE][+-]?\d+)?/, JsonToken.Number],
    [/"(?:(?:(?!["\\])[\u{0020}-\u{ffff}])|(?:\\(?:["\\\/bnrt]|(?:u[0-9a-fA-F]{4}))))*"/u, JsonToken.String],
    [/[\t\n\r ]+/, JsonToken.Whitespace],
    [/./, JsonToken.Unknown]);

// Terminals
const number = expect(map(token(JsonToken.Number), t => <any>Number(t.text)), "<number>")
const string = expect(map(token(JsonToken.String), 
    t => <any>t.text.substring(1, t.text.length - 1)), "<string>")
const whitespace = expect(optional(map(token(JsonToken.Whitespace), 
    t => <any>t.text), ""), "<whitespace>")
const littrue = expect(map(token(JsonToken.True), t => <any>true), "true")
const litfalse = expect(map(token(JsonToken.False), t => <any>false), "false")
const litnull = expect(map(token(JsonToken.Null), t => <any>null), "null")
const comma = expect(token(JsonToken.Comma), ",")
const colon = expect(token(JsonToken.Colon), ":")
const beginarray = expect(token(JsonToken.LeftBracket), "[")
const endarray = expect(token(JsonToken.RightBracket), "]")
const beginobject = expect(token(JsonToken.LeftBrace), "{")
const endobject = expect(token(JsonToken.RightBrace), "}")

// Nonterminals
const element = new Ref<Parser<any, Token<JsonToken>>>()
const elements = trace(oneOrMoreSeparatedBy(forwardRef(element), comma), "elements")
const array = trace(map(bracket(or(elements, whitespace), beginarray, endarray), 
    es => typeof es === "string" ? [] : es), "array")
const member = trace(
    bind(whitespace, ws1 =>
    bind(string, s =>
    bind(whitespace, ws2 =>
    bind(colon, c =>
    bind(forwardRef(element), e =>
    mret(<[string, any]>[s, e])))))), "member")
const members = trace(oneOrMoreSeparatedBy(member, comma), "members")
const object = trace(map(bracket(or(members, whitespace), beginobject, endobject),
    ms => typeof ms === "string" ? <any>{} : initObject(ms)), "object")
const value = trace(choose((token: Token<JsonToken>) => { 
    switch (token.token) {
        case JsonToken.LeftBrace: return object
        case JsonToken.LeftBracket: return array
        case JsonToken.String: return string
        case JsonToken.Number: return number
        case JsonToken.True: return littrue
        case JsonToken.False: return  litfalse
        default: return litnull
    }}), "value")
element.target = trace(bracket(value, whitespace, whitespace), "element")
const json = trace(element.target, "json")

/**
 * Create lexer input stream for JSON string.
 * @param text JSON string to be lexed.
 */
export function jsonInput(text: string): ParserInput<Token<JsonToken>> {
    return lexerInput<JsonToken>(text, lexer);
}

/**
 * Parse a JSON string into a JS/TS value. Throws an exception, if parsing fails.
 * @param text JSON string to be parsed.
 */
export function parseJson(text: string): any {
    return parse(json, jsonInput(text))
}