import { ParserInput } from "./input";
import { escapeWhitespace } from "./utils";

interface TokenMatcher<S> {
    regex: RegExp
    token: S
}

export class Token<S> {
    token: S
    text: string
    
    constructor(token: S, text: string) {
        this.token = token
        this.text = text
    }

    toString() {
        return this.text ? escapeWhitespace(this.text) : this.token
    }
}

export class Lexer<S> {
    private matchers: TokenMatcher<S>[]

    constructor(...tokens: [RegExp, S][]) {
        this.matchers = tokens.map(t => ({
            regex: new RegExp(t[0], "yu"),
            token: t[1]
        }))    
    }

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

class LexerInput<S> implements ParserInput<Token<S>> {
    position: number
    current: Token<S>
    state: any

    private input: string
    private lexer: Lexer<S>
    private tokens: Token<S>[]
    private eof = { done: true, value: <Token<S>><unknown>undefined }

    constructor(input: string, lexer: Lexer<S>) {
        this.input = input
        this.lexer = lexer
        this.tokens = new Array<Token<S>>(input.length)
        this.position = -1
        this.current = this.eof.value
    }

    next(): IteratorResult<Token<S>> {
        let pos = this.position
        pos += this.tokens[pos] ? this.tokens[pos].text.length : 1
        if (pos >= this.input.length)
            return this.eof
        this.position = pos
        let match = this.tokens[pos] || this.lexer.matchToken(this.input, pos)
        this.tokens[pos] = match
        this.current = match      
        return match ?
            { done: false, value: match } :
            this.eof
    }
}

export function lexerInput<S>(text: string, lexer: Lexer<S>): ParserInput<Token<S>> {
    return new LexerInput<S>(text, lexer)
}