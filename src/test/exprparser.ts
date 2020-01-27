/**
 * # Parsing Arithmetic Expressions
 * 
 * A common way to demonstrate parser construction is to use a grammar that
 * represents arithmetic expressions. We build a parser for simple expressions
 * that consist of addition, subtraction, multiplication, and division 
 * operations.
 */
import * as pz from "../";

/**
 * ## Tokens
 * 
 * Tokens include numbers, parenthesis, operators, and whitespace.
 */
export enum ExprToken { 
    Number, OpenParen, CloseParen, Plus, Minus, Multiply, Divide, Whitespace 
}
/**
 * To turn on debugging, set on the following flag. It outputs evaluated
 * parsing rules, which helps understanding the operation.
 */
pz.parserDebug.debugging = false
/**
 * ## Lexer
 * 
 * The lexer can be constructed with a single expression. We specify the
 * regular expression that accepts a given token, and associate it to the 
 * member of the enumeration defined above.
 */
const lexer = new pz.Lexer<ExprToken>(
    [/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/, ExprToken.Number],
    [/\(/, ExprToken.OpenParen],
    [/\)/, ExprToken.CloseParen],
    [/\+/, ExprToken.Plus],
    [/-/, ExprToken.Minus],
    [/\*/, ExprToken.Multiply],
    [/\//, ExprToken.Divide],
    [/[\t\n\r ]+/, ExprToken.Whitespace]);
/**
 * ## Parser
 * 
 * Parser is built from two kinds of parsing rules: ones that recognize 
 * _terminals_ and others that recognize _nonterminals_.
 *
 * ### Terminals
 * 
 * Terminal parsers recognize the tokens returned by the lexer. They are
 * straightforward to define.
 * 
 * First we define a parser that skips any whitespace between the tokens.  
 */
const optws = pz.terminal(ExprToken.Whitespace, "<whitespace>").optionalRef()
/**
 * Next we define parser for numbers. We convert the recognized text to `number`
 * type. We skip the trailing whitespace with the `followedBy` combinator.
 */
const number = pz.terminal(ExprToken.Number, "<number>")
    .map(t => Number(t.text)).followedBy(optws)
/**
 * Parenthesis and operators are all recognized the same way. Again, we skip the
 * trailing whitespace to keep the other rules simple.
 */
const openParen = pz.terminal(ExprToken.OpenParen, "(").followedBy(optws)
const closeParen = pz.terminal(ExprToken.CloseParen, ")").followedBy(optws)
const plus = pz.terminal(ExprToken.Plus, "+").followedBy(optws)
const minus = pz.terminal(ExprToken.Minus, "-").followedBy(optws)
const multiply = pz.terminal(ExprToken.Multiply, "*").followedBy(optws)
const divide = pz.terminal(ExprToken.Divide, "/").followedBy(optws)
/**
 * ### Nonterminals
 * 
 * The abstract nodes in a syntax tree are called nonterminals. We define a 
 * parser for each nonterminal. Since expressions can theoretically be
 * infinitely long, the parsers are recursive.
 * 
 * First we define parsers for operators. We utilize the `operators` combinator
 * which is designed just for this purpose. These parsers calculate the result 
 * of the operation, and return it to the parent parser.
 */
const addop = pz.operators(
    [plus, (a: number, b: number) => a + b],
    [minus, (a: number, b: number) => a - b])
const mulop = pz.operators(
    [multiply, (a: number, b: number) => a * b],
    [divide, (a: number, b: number) => a / b])
/**
 * Terms are the results of multiplication or division operators. We define
 * the term parser as a reference as we need the factor parser in its 
 * definition.
 */
const term = new pz.Ref<pz.Parser<number, pz.Token<ExprToken>>>()
/**
 * Expressions consist of terms that are added or subtracted together. Note how
 * the grammar implicitly defines the precedence order as terms are recognized 
 * before the expressions.
 */
const expr = pz.forwardRef(term).chainOneOrMore(addop)
/**
 * To change the precedence order we uses parenthesis as usual. When an
 * expression is surrounded by parentehesis it becomes a factor which is 
 * recognized before terms. So, a factor is either a number or an expression
 * in parenthesis.
 */
const factor = expr.bracketedBy(openParen, closeParen).or(number)
/**
 * Now we can define the term as sequence of factors separated by multiplication
 * or division operators.
 */
term.target = factor.chainOneOrMore(mulop)
/**
 * Last we define the root parser, which just skips any leading whitespace
 * before calling the expression parser. Whitespace in-between tokens is 
 * skipped by terminal parsers.
 */
const rootExpr = optws.seq(expr)
/**
 * ## Exported Parsing Function
 * 
 * Now we can define the helper functions which parses an expression string and 
 * calculates its value. To get a `ParserInput<ExprToken>` interface required 
 * by the parser, we call the `lexerInput` function, which takes the lexer and 
 * input expression as arguments.
 *
 * After that we can call the `parse` function which takes the root grammar
 * rule and the input as parameters.
  */
export function evaluateExpression(expression: string): number {
    return pz.parse(rootExpr, pz.lexerInput<ExprToken>(expression, lexer))
}