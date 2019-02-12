
/**
 * Parser Input
 * ------------
 * Input to parsers is a stream of data items of type `S`. The input is represented
 * by an abstract interface which extends the `Iterator<S>` interface. It provides 
 * the `next()` method to iterate through the stream. 
 */
export interface ParserInput<S> extends Iterator<S> {
    /**
     * Position in the input stream is represented by a number. The number has 
     * to increase as input is consumed, but not necessarily linearly. Backtracking
     * is done by setting the `position` explicitly.
     */
    position: number
    /**
     * The last item read from the stream. This is cached for efficiency.
     */
    readonly current: S
    /**
     * User-managed state can be carried along the parsing. It is useful especially
     * with context-sensitive grammars. The input stores a reference to `any` data
     * that can be modified by special combinators: `getState`, `setState`, 
     * `mutateState`, etc.
     */
    state: any
}

/**
 * Array Input
 * -----------
 * To parse an array we provide wrapper that encapsulates it in the ParserInput 
 * interface. The items of the array may have any type `S`. The class is not
 * exported outside the module. Users can create it using the `arrayInput()` 
 * function.
 */
class ArrayInput<S> implements ParserInput<S> {
    position: number
    current: S
    state: any

    private array: S[];

    /**
     * Create an ArrayInput object.
     */
    constructor(array: S[]) {
        this.array = array
        this.position = -1
        this.current = <S><unknown>undefined
    }

    /**
     * Return the next item in the array. Update `position` and
     * `current` fields. Inherited from the `Iterator<S>` interface.
     */
    next(): IteratorResult<S> {
        let pos = this.position + 1
        if (pos >= this.array.length)
            return { done: true, value: <S><unknown>undefined }
        this.position = pos
        this.current = this.array[pos]
        return { done: false, value: this.current }
    }
}

/**
 * Exported Functions
 * ------------------
 * Create a ParserInput wrapper for an array.
 */
export function arrayInput<S>(array: S[]): ParserInput<S> {
    return new ArrayInput<S>(array);
}