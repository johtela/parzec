import * as pz from "..";

// Tokens
export enum JsonToken {
    True, False, Null, LeftBrace, RightBrace, LeftBracket, RightBracket, Comma,
    Colon, Number, String, Whitespace
}

pz.parserDebug.debugging = false

const lexer = new pz.Lexer<JsonToken>(
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
    [/"(?:(?:(?!["\\])[\u{0020}-\u{ffff}])|(?:\\(?:["\\\/bnfrt]|(?:u[0-9a-fA-F]{4}))))*"/u,
        JsonToken.String],
    [/[\t\n\r ]+/, JsonToken.Whitespace]);

// Terminals
const number = pz.token(JsonToken.Number).map(t => <any>Number(t.text))
    .expect("<number>")
const string = pz.token(JsonToken.String).map(t => <any>JSON.parse(t.text))
    .expect("<string>")
const whitespace = pz.token(JsonToken.Whitespace).map(t => <any>t.text)
    .optional("").expect("<whitespace>")
const littrue = pz.token(JsonToken.True).map(t => <any>true).expect("true")
const litfalse = pz.token(JsonToken.False).map(t => <any>false).expect("false")
const litnull = pz.token(JsonToken.Null).map(t => <any>null).expect("null")
const comma = pz.token(JsonToken.Comma).expect(",")
const colon = pz.token(JsonToken.Colon).expect(":")
const beginarray = pz.token(JsonToken.LeftBracket).expect("[")
const endarray = pz.token(JsonToken.RightBracket).expect("]")
const beginobject = pz.token(JsonToken.LeftBrace).expect("{")
const endobject = pz.token(JsonToken.RightBrace).expect("}")

// Nonterminals
const element = new pz.Ref<pz.Parser<any, pz.Token<JsonToken>>>()
const elements = pz.forwardRef(element).oneOrMoreSeparatedBy(comma)
    .trace("elements")
const array = elements.or(whitespace).bracketedBy(beginarray, endarray)
    .map(es => typeof es === "string" ? [] : es).trace("array")
const member = whitespace.bind(
        ws1 => string.bind(
        s => whitespace.bind(
        ws2 => colon.bind(
        c => pz.forwardRef(element).bind(
        e => pz.mret(<[string, any]>[s, e]))))))
        .trace("member")                        
const members = member.oneOrMoreSeparatedBy(comma).trace("members")
const object = members.or(whitespace).bracketedBy(beginobject, endobject)
    .map(ms => typeof ms === "string" ? <any>{} : pz.initObject(ms))
    .trace("object")
const value = pz.choose(
    (token: pz.Token<JsonToken>) => {
        switch (token.token) {
            case JsonToken.LeftBrace: return object
            case JsonToken.LeftBracket: return array
            case JsonToken.String: return string
            case JsonToken.Number: return number
            case JsonToken.True: return littrue
            case JsonToken.False: return litfalse
            case JsonToken.Null: return litnull
            default: return pz.fail<any, pz.Token<JsonToken>>(token.text,
                "{", "[", "<string>", "<number>", "true", "false", "null")
        }
    }).trace("value")
element.target = value.bracketedBy(whitespace, whitespace).trace("element")
const json = element.target.trace("json")

/**
 * Create lexer input stream for JSON string.
 * @param text JSON string to be lexed.
 */
export function jsonInput(text: string): pz.ParserInput<pz.Token<JsonToken>> {
    return pz.lexerInput<JsonToken>(text, lexer);
}

/**
 * Parse a JSON string into a JS/TS value. Throws an exception, if parsing fails.
 * @param text JSON string to be parsed.
 */
export function parseJson(text: string): any {
    return pz.parse(json, jsonInput(text))
}