import { Token, Lexer, lexerInput } from "../lexer";
import { Parser, expect, map, token, optional, forwardRef, parse, parserDebug, seq, or } 
    from "../parser";
import { bracketedBy, chainOneOrMore, operators, followedBy } from "../arrayparsers";
import { Ref } from "../ref";

// Tokens
export enum ExprToken { Number, OpenParen, CloseParen, Plus, Minus, Multiply, Divide, Whitespace }

parserDebug.debugging = false

const lexer = new Lexer<ExprToken>(
    [/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/, ExprToken.Number],
    [/\(/, ExprToken.OpenParen],
    [/\)/, ExprToken.CloseParen],
    [/\+/, ExprToken.Plus],
    [/-/, ExprToken.Minus],
    [/\*/, ExprToken.Multiply],
    [/\//, ExprToken.Divide],
    [/[\t\n\r ]+/, ExprToken.Whitespace]);

// Terminals
const optws = expect("<whitespace>", 
    optional(map(token(ExprToken.Whitespace), t => t.text), ""))
const number = expect("<number>", 
    followedBy(map(token(ExprToken.Number), t => Number(t.text)), optws))
const openParen = expect("(", followedBy(token(ExprToken.OpenParen), optws)) 
const closeParen = expect(")", followedBy(token(ExprToken.CloseParen), optws))
const plus = expect("+", followedBy(token(ExprToken.Plus), optws))
const minus = expect("-", followedBy(token(ExprToken.Minus), optws))
const multiply = expect("*", followedBy(token(ExprToken.Multiply), optws))
const divide = expect("/", followedBy(token(ExprToken.Divide), optws))

// Nonterminals
const addop = operators(
    [plus, (a: number, b: number) => a + b],
    [minus, (a: number, b: number) => a - b])
const mulop = operators(
    [multiply, (a: number, b: number) => a * b],
    [divide, (a: number, b: number) => a / b])
const term = new Ref<Parser<number, Token<ExprToken>>>()
const expr = chainOneOrMore(forwardRef(term), addop)
const factor = or(bracketedBy(expr, openParen, closeParen), number)
term.target = chainOneOrMore(factor, mulop)
const rootExpr = seq(optws, expr)

/**
 * Parse an expresion string and calculate its value. 
 * @param text Expression string to be parsed.
 */
export function evaluateExpression(expression: string): number {
    return parse(rootExpr, lexerInput<ExprToken>(expression, lexer))
}