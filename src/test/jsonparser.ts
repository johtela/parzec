import { ParserInput } from "../parserinput";
import { Token, Lexer, lexerInput } from "../lexer";
import { Parser, expect, map, token, optional, bind, forwardRef, or, mret, any, parse, trace, parserDebug, tryRule } from "../parser";
import { oneOrMoreSeparatedBy, bracket } from "../arrayparsers";
import { Ref } from "../ref";

// Tokens
export enum JsonToken {
    True, False, Null, LeftBrace, RightBrace, LeftBracket, RightBracket, Comma, Colon,
    Digit, Point, Exp, Plus, Minus, Number, String, Whitespace, Unknown
}

parserDebug.debugging = true

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
const number = trace(expect(map(token(JsonToken.Number), t => <any>Number(t.text)), "<number>"), "number")
const string = trace(expect(map(token(JsonToken.String), t => <any>t.text.substring(1, t.text.length - 1)), 
    "<string>"), "string")
const whitespace = trace(expect(optional(map(token(JsonToken.Whitespace), t => <any>t.text), ""), 
    "<whitespace>"), "whitespace")
const littrue = trace(expect(map(token(JsonToken.True), t => <any>true), "true"), "true")
const litfalse = trace(expect(map(token(JsonToken.False), t => <any>false), "false"), "false")
const litnull = trace(expect(map(token(JsonToken.Null), t => <any>null), "null"), "null")
const comma = trace(expect(token(JsonToken.Comma), ","), "comma")
const colon = trace(expect(token(JsonToken.Colon), ":"), "colon")
const beginarray = trace(expect(token(JsonToken.LeftBracket), "["), "beginarray")
const endarray = trace(expect(token(JsonToken.RightBracket), "]"), "endarray")
const beginobject = trace(expect(token(JsonToken.LeftBrace), "{"), "beginobject")
const endobject = trace(expect(token(JsonToken.RightBrace), "}"), "endobject")

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
const value = trace(any(object, array, string, number, littrue, litfalse, litnull), "value")
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

function initObject(members: [string, any][]): any {
    let res: any = {}
    for (let i = 0; i < members.length; i++) {
        let [m, v] = members[i];
        res[m] = v
    }
    return res
}