
export enum ParseDirection { Forward = 1, Backward = -1 }

export interface ParserInput<S> extends Iterator<S> {
    position: number
    readonly current: S
    direction: ParseDirection
    state: any
}

class StringInput implements ParserInput<string> {
    position: number
    current: string
    direction: ParseDirection
    state: any

    private text: string;

    constructor(text: string) {
        this.text = text
        this.position = -1
        this.current = ""
        this.direction = ParseDirection.Forward
    }

    next(): IteratorResult<string> {
        let pos = this.position + this.direction
        if (pos < 0 || pos >= this.text.length)
            return { done: true, value: "" }
        this.position = pos
        this.current = this.text[pos]
        return { done: false, value: this.current }
    }
}

class ArrayInput<S> implements ParserInput<S> {
    position: number
    current: S
    direction: ParseDirection
    state: any

    private array: S[];

    constructor(array: S[]) {
        this.array = array
        this.position = -1
        this.current = <S><unknown>undefined
        this.direction = ParseDirection.Forward
    }

    next(): IteratorResult<S> {
        let pos = this.position + this.direction
        if (pos < 0 || pos >= this.array.length)
            return { done: true, value: <S><unknown>undefined }
        this.position = pos
        this.current = this.array[pos]
        return { done: false, value: this.current }
    }
}

export function stringInput(text: string): ParserInput<string> {
    return new StringInput(text);
}

export function arrayInput<S>(array: S[]): ParserInput<S> {
    return new ArrayInput<S>(array);
}