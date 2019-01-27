
export interface ParserInput<S> extends Iterator<S> {
    position: number
    readonly current: S
    state: any
}

class StringInput implements ParserInput<string> {
    position: number
    current: string
    state: any

    private text: string;

    constructor(text: string) {
        this.text = text
        this.position = -1
        this.current = ""
    }

    next(): IteratorResult<string> {
        let pos = this.position + 1
        if (pos >= this.text.length)
            return { done: true, value: "" }
        this.position = pos
        this.current = this.text[pos]
        return { done: false, value: this.current }
    }
}

class ArrayInput<S> implements ParserInput<S> {
    position: number
    current: S
    state: any

    private array: S[];

    constructor(array: S[]) {
        this.array = array
        this.position = -1
        this.current = <S><unknown>undefined
    }

    next(): IteratorResult<S> {
        let pos = this.position + 1
        if (pos >= this.array.length)
            return { done: true, value: <S><unknown>undefined }
        this.position = pos
        this.current = this.array[pos]
        return { done: false, value: this.current }
    }
}

interface TokenMatcher<S> {
    regex: RegExp
    token: S
}

export interface TokenMatch<S> {
    token: S
    text: string
}

class Lexer<S> implements ParserInput<TokenMatch<S>> {
    position: number
    current: TokenMatch<S>
    state: any

    private input: string
    private matchers: TokenMatcher<S>[]
    private tokens: TokenMatch<S>[]
    private eof = { done: true, value: <TokenMatch<S>><unknown>undefined }

    constructor(input: string, tokens: [string, S][]) {
        this.input = input
        this.matchers = tokens.map(t => ({
            regex: new RegExp(t[0], "y"),
            token: t[1]
        }))
        this.tokens = new Array<TokenMatch<S>>(input.length)
        this.position = -1
        this.current = this.eof.value
    }

    private matchToken(): TokenMatch<S> | null {
        let pos = this.position
        let res = this.tokens[pos]
        if (res)
            return res;
        for (let i = 0; i < this.matchers.length; i++) {
            let matcher = this.matchers[i]
            matcher.regex.lastIndex = pos
            let match = matcher.regex.exec(this.input)
            if (match != null) {
                res = { token: matcher.token, text: match[0] }
                this.tokens[pos] = res
                return res
            }
        }
        return null
    }

    next(): IteratorResult<TokenMatch<S>> {
        let pos = this.position
        pos += this.tokens[pos] ? this.tokens[pos].text.length : 1
        if (pos >= this.input.length)
            return this.eof
        this.position = pos
        let match = this.matchToken();
        return match ?
            { done: false, value: this.current = match } :
            this.eof
    }
}

export function stringInput(text: string): ParserInput<string> {
    return new StringInput(text);
}

export function arrayInput<S>(array: S[]): ParserInput<S> {
    return new ArrayInput<S>(array);
}

export function lexer<S>(text: string, tokens: [string, S][]): 
    ParserInput<TokenMatch<S>> {
    return new Lexer<S>(text, tokens)
}