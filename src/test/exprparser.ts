import * as pz from "../";

// Tokens
export enum ExprToken { 
    Number, OpenParen, CloseParen, Plus, Minus, Multiply, Divide, Whitespace 
}

pz.parserDebug.debugging = false

const lexer = new pz.Lexer<ExprToken>(
    [/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/, ExprToken.Number],
    [/\(/, ExprToken.OpenParen],
    [/\)/, ExprToken.CloseParen],
    [/\+/, ExprToken.Plus],
    [/-/, ExprToken.Minus],
    [/\*/, ExprToken.Multiply],
    [/\//, ExprToken.Divide],
    [/[\t\n\r ]+/, ExprToken.Whitespace]);

// Terminals
const optws = pz.terminal(ExprToken.Whitespace, "<whitespace>").map(t => t.text)
    .optional("")
const number = pz.terminal(ExprToken.Number, "<number>").map(t => Number(t.text))
    .followedBy(optws)
const openParen = pz.terminal(ExprToken.OpenParen, "(").followedBy(optws)
const closeParen = pz.terminal(ExprToken.CloseParen, ")").followedBy(optws)
const plus = pz.terminal(ExprToken.Plus, "+").followedBy(optws)
const minus = pz.terminal(ExprToken.Minus, "-").followedBy(optws)
const multiply = pz.terminal(ExprToken.Multiply, "*").followedBy(optws)
const divide = pz.terminal(ExprToken.Divide, "/").followedBy(optws)

// Nonterminals
const addop = pz.operators(
    [plus, (a: number, b: number) => a + b],
    [minus, (a: number, b: number) => a - b])
const mulop = pz.operators(
    [multiply, (a: number, b: number) => a * b],
    [divide, (a: number, b: number) => a / b])
const term = new pz.Ref<pz.Parser<number, pz.Token<ExprToken>>>()
const expr = pz.forwardRef(term).chainOneOrMore(addop)
const factor = expr.bracketedBy(openParen, closeParen).or(number)
term.target = factor.chainOneOrMore(mulop)
const rootExpr = optws.seq(expr)

/**
 * Parse an expresion string and calculate its value. 
 */
export function evaluateExpression(expression: string): number {
    return pz.parse(rootExpr, pz.lexerInput<ExprToken>(expression, lexer))
}