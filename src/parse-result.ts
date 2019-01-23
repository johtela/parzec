export abstract class ParseResult<T> {
    private _position: number

    abstract get success(): boolean
    abstract get result(): T
    abstract get found(): string
    abstract get expected(): string[]
    
    get position(): number {
        return this._position
    }

    constructor(position: number) {
        this._position = position
    }

    mergeExpected(other: ParseResult<T>) {
        let res = this.expected
        if (other instanceof Fail && other.expected.length > 0)
            res = res.concat(other.expected)
        return res
    }
}

class Ok<T> extends ParseResult<T> {
    private _result: T

    constructor(position: number, result: T) {
        super(position)
        this._result = result
    }

    get success(): boolean {
        return true;
    }

    get result(): T {
        return this._result
    }

    get found(): string {
        throw Error("No terminal available")
    }

    get expected(): string[] {
        throw Error("Expected terminals not available")
    }
}

class Fail<T> extends ParseResult<T> {
    private _found: string
    private _expected: string[]

    constructor(position: number, found: string, expected: string[]) {
        super(position)
        this._found = found
        this._expected = expected
    }

    get success(): boolean {
        return false;
    }

    get result(): T {
        throw Error("No result available")
    }

    get found(): string {
        return this._found
    }

    get expected(): string[] {
        return this._expected
    }
}

export function succeeded<T>(position: number, result: T) {
    return new Ok<T>(position, result)
}

export function failed<T>(position: number, found: string, expected: string[] = []) {
    return new Fail<T>(position, found, expected)
}