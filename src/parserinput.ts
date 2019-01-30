
export interface ParserInput<S> extends Iterator<S> {
    position: number
    readonly current: S
    state: any
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

export function arrayInput<S>(array: S[]): ParserInput<S> {
    return new ArrayInput<S>(array);
}