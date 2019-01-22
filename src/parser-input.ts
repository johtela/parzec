
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
        this.position = 0
        this.direction = ParseDirection.Forward
        this.state = null
    }

    next(): IteratorResult<string> {
        return this.position >= this.text.length ?
            { done: true, value: "" } :
            { done: false, value: this.text[this.position++] }
    }
}

class ArrayInput<S> implements ParserInput<S> {
    position: number 
    direction: ParseDirection
    state: object | null

    private array: S[];

    constructor(array: S[]) {
        this.array = array
        this.position = 0
        this.direction = ParseDirection.Forward
        this.state = null
    }

    next(): IteratorResult<S> {
        return this.position >= this.array.length ?
            { done: true, value: undefined as unknown as S } :
            { done: false, value: this.array[this.position++] }
    }
}

export function stringInput(text: string): ParserInput<string> {
    return new StringInput(text);
}

export function arrayInput<S>(array: S[]): ParserInput<S> {
    return new ArrayInput<S>(array);
}