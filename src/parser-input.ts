
export enum ParseDirection { Forward = 1, Backward = -1 }

export interface ParserInput<S> extends Iterator<S> {
    position: number
    direction: ParseDirection
    state: object | null
}

class StringInput implements ParserInput<string> {
    position: number
    direction: ParseDirection
    state: object | null

    private text: string;

    constructor(text: string) {
        this.text = text
        this.position = -1
        this.direction = ParseDirection.Forward
        this.state = null
    }

    next(): IteratorResult<string> {
        let pos = this.position + this.direction
        if (pos < 0 || pos >= this.text.length)
            return { done: true, value: "" }
        this.position = pos
        return { done: false, value: this.text[pos] }
    }
}

class ArrayInput<S> implements ParserInput<S> {
    position: number
    direction: ParseDirection
    state: object | null

    private array: S[];

    constructor(array: S[]) {
        this.array = array
        this.position = -1
        this.direction = ParseDirection.Forward
        this.state = null
    }

    next(): IteratorResult<S> {
        let pos = this.position + this.direction
        if (pos < 0 || pos >= this.array.length)
            return { done: true, value: <S><unknown>undefined }
        this.position = pos
        return { done: false, value: this.array[pos] }
    }
}

export function stringInput(text: string): ParserInput<string> {
    return new StringInput(text);
}

export function arrayInput<S>(array: S[]): ParserInput<S> {
    return new ArrayInput<S>(array);
}