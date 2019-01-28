import { ParserInput } from "../parserinput";
import { Token, Lexer, lexerInput } from "../lexer";
import { Parser, expect, map, token, optional, bind, forwardRef, or, mret, any } from "../parser";
import { oneOrMoreSeparatedBy } from "../arrayparsers";
import { Ref } from "../ref";

// Tokens
export enum JsonToken {
    True, False, Null, LeftBrace, RightBrace, LeftBracket, RightBracket, Comma, Colon,
    Digit, Point, Exp, Plus, Minus, Number, String, Whitespace, Unknown
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
    [/\-?(?:[1-9]\d+|\d(?!\d))(?:\.\d+)?(?:[eE][+-]?\d+)?/, JsonToken.Number],
    [/"(?:(?:(?!["\\])[\u{0020}-\u{10ffff}])|(?:\\(?:["\\\/bnrt]|(?:u[0-9a-fA-F]{4}))))*"/, JsonToken.String],
    [/[\t\n\r ]+/, JsonToken.Whitespace],
    [/./, JsonToken.Unknown]);

// Terminals
const number = expect(map(token(JsonToken.Number), t => <any>Number(t.text)), "number")
const string = expect(map(token(JsonToken.String), t => <any>t.text), "string")
const whitespace = expect(optional(map(token(JsonToken.Whitespace), t => <any>t.text), ""), "whitespace")
const littrue = expect(map(token(JsonToken.True), t => <any>true), "true")
const litfalse = expect(map(token(JsonToken.True), t => <any>false), "false")
const litnull = expect(map(token(JsonToken.True), t => <any>null), "null")
const comma = expect(token(JsonToken.Comma), ",")
const colon = expect(token(JsonToken.Colon), ":")
const beginarray = expect(token(JsonToken.LeftBracket), "[")
const endarray = expect(token(JsonToken.RightBracket), "]")
const beginobject = expect(token(JsonToken.LeftBrace), "{")
const endobject = expect(token(JsonToken.RightBrace), "}")

// Nonterminals
const element = new Ref<Parser<any, Token<JsonToken>>>()
const elements = oneOrMoreSeparatedBy(forwardRef(element), comma)
const array = 
    bind(beginarray, b =>
    bind(or(elements, whitespace), es =>
    bind(endarray, e =>
    mret(typeof es === "string" ? [] : es))))
const member =
    bind(whitespace, ws1 =>
    bind(string, s =>
    bind(whitespace, ws2 =>
    bind(colon, c =>
    bind(forwardRef(element), e =>
    mret(<[string, any]>[s, e]))))))
const members = oneOrMoreSeparatedBy(member, comma)
const object =
    bind(beginobject, b =>
    bind(or(members, whitespace), ms =>
    bind(endobject, e =>
    mret(typeof ms === "string" ? <any>{} : initObject(ms)))))
const value = any(object, array, string, number, littrue, litfalse, litnull)
element.target = 
    bind(whitespace, ws1 =>
    bind(value, v =>
    bind(whitespace, ws2 =>
    mret(v))))
const json = element.target

/**
 * Create lexer input stream for JSON string.
 * @param text JSON string to be parsed.
 */
export function jsonInput(text: string): ParserInput<Token<JsonToken>> {
    return lexerInput<JsonToken>(text, lexer);
}

function initObject(members: [string, any][]): any {
    let res: any = {}
    for (let i = 0; i < members.length; i++) {
        let [m, v] = members[i];
        res[m] = v
    }
    return res
}