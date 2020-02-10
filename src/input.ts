/**
 * # Parser Input
 * 
 * Parsers input is a stream of data of type `S`. The input is represented by 
 * an abstract interface which provides the `next()` method to iterate through 
 * the stream. 
 */
export interface ParserInput<S> {
    /**
     * Position in the input stream is represented by a number. The number has 
     * to increase as input is consumed, but not necessarily linearly. 
     * Backtracking is done by setting the `position` explicitly.
     */
    position: number
    /**
     * Return the next item in the stream. Note that there is no explicit
     * flag that tells when we have gone past the last item. Instead, the input
     * implementations add a special `EOF` item at the end. Parsers should 
     * recognize it and terminate before the stream is exhausted.
     */
    next(): S
    /**
     * The latest item read from the stream is cached for efficiency.
     */
    readonly current: S
    /**
     * User-managed state can be carried along the parsing. State is needed 
     * especially with context-sensitive grammars. The input stores a reference 
     * to `any` data that can be modified by special combinators: `getState`, 
     * `setState`, `mutateState`, etc.
     */
    state: any
}
/**
 * ## Array Input
 * 
 * Arrays are the most common input data type. Therefore we provide a generic
 * implementation for them. Array items may have any type `S`. The class is 
 * not exported outside the module. Users can create it using the `arrayInput` 
 * function.
 */
class ArrayInput<S> implements ParserInput<S> {
    /**
     * Inherited properties.
     */
    position: number
    current: S
    state: any
    eof: S
    /**
     * Wrapped array.
     */
    private array: S[];
    /**
     * We set the position initially to -1 to indicate that no input has been
     * consumed. The current item is `undefined`.
     */
    constructor(array: S[], eof: S) {
        this.array = array
        this.position = -1
        this.current = <S><unknown>undefined
        this.eof = eof
    }
    /**
     * Return the next item in the array. Update `position` and
     * `current` fields. 
     */
    next(): S {
        let pos = this.position + 1
        if (pos >= this.array.length)
            return this.eof
        this.position = pos
        this.current = this.array[pos]
        return this.current
    }
}

/**
 * ## Exported Functions
 * 
 * Create a ParserInput wrapper for an array.
 */
export function arrayInput<S>(array: S[], eof: S): ParserInput<S> {
    return new ArrayInput<S>(array, eof);
}