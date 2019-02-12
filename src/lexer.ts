/**
 * @module lexer
 * 
 * Lexical Analyzer
 * ================
 * Lexical analyzer or [_lexer_](https://en.wikipedia.org/wiki/Lexical_analysis) 
 * is a program that converts sequence of characters into a sequence of _tokens_. 
 * It simplifies and speeds up parsing because the parser does not have to recognize 
 * low level patterns such as whitespace, keywords, identifiers, or numbers. Instead, 
 * the parser can focus on the higher level grammar and structure of the input.
 * 
 * A lexer is usually implemented using a 
 * [deterministic finite automaton](https://en.wikipedia.org/wiki/Deterministic_finite_automaton), 
 * and the DFA is typically represented by a set of regular expressions. This is 
 * a natural choice for us too, as Javascript natively supports them.
 */
import { ParserInput } from "./input"
import { escapeWhitespace } from "./utils"
import { ParseError, ErrorSource } from "./error"

/**
 * Recognizing a Token
 * -------------------
 * The mapping from regular expressions to tokens is defined using the `TokenMatcher<S>`
 * interface. A token can be of any type `S`, although usually an enumeration is used.
 */
interface TokenMatcher<S> {
    regex: RegExp
    token: S
}
/**
 * Representing a Token
 * --------------------
 * When a token is recognized it is wrapped into the `Token<S>` class. This class
 * contains also the recognized string for error reporting and diagnostics.
 */
export class Token<S> {
    token: S
    text: string
    
    constructor(token: S, text: string) {
        this.token = token
        this.text = text
    }
    /**
     * We override the `toString()` function so we can output a token 
     * to screen.
     */
    toString() {
        return this.text ? escapeWhitespace(this.text) : this.token
    }
}

/**
 * Lexer
 * -----
 * The lexer itself is a simple class that contains all the TokenMatchers and
 * recognizes the next token in a string.
 */
export class Lexer<S> {
    private matchers: TokenMatcher<S>[]

    constructor(...tokens: [RegExp, S][]) {
        this.matchers = tokens.map(t => ({
            regex: new RegExp(t[0], "yu"),
            token: t[1]
        }))    
    }
    /**
     * We check matchers one-by-one in the order they were given to
     * recognize the token in the given position. If none of the matchers
     * succeed, we return null.
     */
    matchToken(input: string, pos: number): Token<S> | null {
        for (let i = 0; i < this.matchers.length; i++) {
            let matcher = this.matchers[i]
            matcher.regex.lastIndex = pos
            let match = matcher.regex.exec(input)
            if (match != null)
                return new Token<S>(matcher.token, match[0])
        }
        return null
    }
}
/**
 * Lexer Input Wrapper
 * -------------------
 * We can integrate lexing directly into the parsing process. We do this by
 * implementing the `ParserInput` interface for any token. We don't expose 
 * `LexerInput` outside the module. It can be created with a constructor 
 * function.
 */
class LexerInput<S> implements ParserInput<Token<S>> {
    /**
     * We define the fields of the `ParserInput` interface in a boilerplate manner.
     */
    position: number
    current: Token<S>
    state: any
    /**
     * We also need to store the input string and the lexer used. These we
     * get as an argument.
     */
    private input: string
    private lexer: Lexer<S>
    /**
     * To avoid recognizing the same token multiple times as the parser
     * backtracks, we store all the tokens we have matched so far in 
     * an array.
     */
    private tokens: Token<S>[]
    /**
     * We also store the result designating end of the input.
     */
    private eof = { done: true, value: <Token<S>><unknown>undefined }
    /**
     * Create an input stream for given string and lexer. Initialize the
     * instance variables.
     */
    constructor(input: string, lexer: Lexer<S>) {
        this.input = input
        this.lexer = lexer
        this.tokens = new Array<Token<S>>(input.length)
        this.position = -1
        this.current = this.eof.value
    }
    /**
     * The iterator implementation is fairly straightforward. We need to make sure
     * that the state variables `position` and `current` keep in sync when we 
     * advance in the input string. We must also update the caché for tokens. 
     * If the lexer cannot recognize the next token, we throw a parse error.
     */
    next(): IteratorResult<Token<S>> {
        let pos = this.position
        pos += this.tokens[pos] ? this.tokens[pos].text.length : 1
        if (pos >= this.input.length)
            return this.eof
        this.position = pos
        let match = this.tokens[pos] || this.lexer.matchToken(this.input, pos)
        if (!match)
            throw new ParseError(ErrorSource.Lexer, pos, 
                this.input.substr(pos, 10) + "...", ["<valid token>"])
        this.tokens[pos] = match
        this.current = match      
        return { done: false, value: match };
    }
}
/**
 * Create an input stream for given `text` string using the given `lexer`.
 */
export function lexerInput<S>(text: string, lexer: Lexer<S>): ParserInput<Token<S>> {
    return new LexerInput<S>(text, lexer)
}