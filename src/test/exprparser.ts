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
const optws = pz.token(ExprToken.Whitespace).map(t => t.text).optional("")
    .expect("<whitespace>") 
const number = pz.token(ExprToken.Number).map(t => Number(t.text))
    .followedBy(optws).expect("<number>")
const openParen = pz.token(ExprToken.OpenParen).followedBy(optws).expect("(")
const closeParen = pz.token(ExprToken.CloseParen).followedBy(optws).expect(")") 
const plus = pz.token(ExprToken.Plus).followedBy(optws).expect("+")
const minus = pz.token(ExprToken.Minus).followedBy(optws).expect("-")
const multiply = pz.token(ExprToken.Multiply).followedBy(optws).expect("*")
const divide = pz.token(ExprToken.Divide).followedBy(optws).expect("/")

// Nonterminals
const addop = pz.operators(
    [plus, (a: number, b: number) => a + b],
    [minus, (a: number, b: number) => a - b])
    .expect("<addop>")
const mulop = pz.operators(
    [multiply, (a: number, b: number) => a * b],
    [divide, (a: number, b: number) => a / b])
    .expect("<mulop>")
const term = new pz.Ref<pz.Parser<number, pz.Token<ExprToken>>>()
const expr = pz.forwardRef(term).chainOneOrMore(addop).expect("<expr>")
const factor = expr.bracketedBy(openParen, closeParen).or(number)
    .expect("<factor>")
term.target = factor.chainOneOrMore(mulop).expect("<term>")
const rootExpr = optws.seq(expr)

/**
 * Parse an expresion string and calculate its value. 
 * @param text Expression string to be parsed.
 */
export function evaluateExpression(expression: string): number {
    return pz.parse(rootExpr, pz.lexerInput<ExprToken>(expression, lexer))
}