/**
 * # Lexical Analyzer
 * 
 * [Lexical analyzer][lexer], also known as lexer or scanner, is a program that 
 * converts sequence of characters into a sequence of _tokens_. It simplifies 
 * and speeds up parsing because the parser does not have to recognize low level 
 * patterns such as whitespace, keywords, identifiers, or numbers. Instead, the 
 * parser can focus on the high level grammar and structure of the input.
 * 
 * A lexer is usually implemented using a [deterministic finite automaton][dfa],
 * and the DFA is typically represented by a regular expression. This is a 
 * natural choice for us too, as Javascript natively supports them.
 * 
 * [lexer]: https://en.wikipedia.org/wiki/Lexical_analysis
 * [dfa]: https://en.wikipedia.org/wiki/Deterministic_finite_automaton 
 */
import * as inp from "./input"
import * as utils from "./utils"
import * as err from "./error"

/**
 * ## Recognizing a Token
 * 
 * The mapping from regular expressions to tokens is defined using the 
 * `TokenMatcher<S>` interface. A token can be of any type `S`, although usually 
 * an enumeration is used.
 */
interface TokenMatcher<S> {
    regex: RegExp
    token: S
}
/**
 * ## Representing a Token
 * 
 * When a token is recognized it is wrapped in a `Token<S>` object. This 
 * contains also the recognized string for error reporting and diagnostics.
 */
export class Token<S> {
    constructor(readonly token: S, readonly text: string) { }
    /**
     * We override the `toString` function so we can output a token 
     * to screen.
     */
    toString() {
        return this.text ? utils.escapeWhitespace(this.text) : this.token
    }
}
/**
 * ## Lexer
 * 
 * The lexer itself is a simple class that contains all the TokenMatchers and
 * recognizes the next token in a string.
 */
export class Lexer<S> {
    private matchers: TokenMatcher<S>[]
    /**
     * The constructor adds two flags to the regular expressions given as 
     * arguments. The `y` flag makes the search sticky so that it scans the
     * input string from the position indicated by the `lastIndex` property.
     * The `u` flag makes the search support unicode characters.
     */
    constructor(...tokens: [RegExp, S][]) {
        this.matchers = tokens.map(t => ({
            regex: new RegExp(t[0], "yu"),
            token: t[1]
        }))
    }
    /**
     * We check matchers one-by-one in the order they were given to
     * recognize the token in the given position. If none of the matchers
     * succeed, we return `null`.
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
 * ## Lexer as Input
 * 
 * We can integrate lexing directly into the parsing process by implementing 
 * the `ParserInput` interface for any token. We don't expose `LexerInput` 
 * class outside the module. It can be created with the `lexerInput` function.
 */
class LexerInput<S> implements inp.ParserInput<Token<S>> {
    /**
     * We define the fields of the `ParserInput` interface.
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
     * We store the result designating end of the input.
     */
    private eof: Token<S>
    /**
     * Create an input stream for given string and lexer. Initialize the
     * instance variables.
     */
    constructor(input: string, lexer: Lexer<S>, eof: Token<S>) {
        this.input = input
        this.lexer = lexer
        this.tokens = new Array<Token<S>>(input.length)
        this.position = -1
        this.eof = eof
        this.current = this.eof
    }
    /**
     * The iterator implementation is fairly straightforward. We need to make 
     * sure that the state variables `position` and `current` are kept in sync 
     * while we advance in the input string. We must also do a lookup in the 
     * caché before calling the lexer to recognize the token. If the lexer finds 
     * a match, we update the caché. If the lexer cannot recognize the next 
     * token, we throw a `ParseError`.
     */
    next(): Token<S> {
        let pos = this.position
        pos += this.tokens[pos] ? this.tokens[pos].text.length : 1
        if (pos >= this.input.length)
            return this.eof
        this.position = pos
        let match = this.tokens[pos] || this.lexer.matchToken(this.input, pos)
        if (!match)
            throw new err.ParseError(err.ErrorSource.Lexer, pos,
                this.input.substr(pos, 10) + "...", ["<valid token>"])
        this.tokens[pos] = match
        this.current = match
        return match
    }
}
/**
 * Create an input stream for given `text` string using the given `lexer`.
 */
export function lexerInput<S>(text: string, lexer: Lexer<S>, eof: Token<S>):
    inp.ParserInput<Token<S>> {
    return new LexerInput<S>(text, lexer, eof)
}