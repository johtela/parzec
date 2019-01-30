interface Position {
    position: number
}

interface Ok<T> extends Position {
    kind: "ok"
    result: T
}

interface Fail extends Position {
    kind: "fail"
    found: string
    expected: string[]
}

export type ParseResult<T> = Ok<T> | Fail

export function joinExpected(result: Fail, other: Fail) {
    if (other.expected.length > 0)
        result.expected = result.expected.concat(other.expected)
}

export function expectedAsCsv(result: Fail): string {
        return result.expected.map(s => `"${s}"`).join(", ")
}

export function succeeded<T>(pos: number, res: T): ParseResult<T> {
    return {
        kind: "ok",
        position: pos, 
        result: res
    }
}

export function failed<T>(pos: number, fnd: string, exp: string[] = []): ParseResult<T> {
    return {
        kind: "fail",
        position: pos, 
        found: fnd, 
        expected: exp
    }
}