/**
 * # Reference Cells
 * 
 * `Ref<T>` class provides a simple reference cell, which can be used
 * as a surrogate for a parser that is defined later on. We can define 
 * a _reference_ to parser, but we don't have to give the target right
 * away. When composing parsers we can use the `forwardRef` function
 * to pass a reference to any combinator expecting a `Parser<T, S>`.
 * Of course, we have to eventually assign a real parser as the target
 * of the reference before running the parser.     
 */
export class Ref<T> {
    private _target: T | null = null
    /**
     * Constructing a reference. The target value is optional.
     */
    constructor(value?: T) {
        if (value)
            this._target = value
    }
    /**
     * Get the target of the reference. If no target is set, a 
     * `ReferenceError` is thrown.
     */
    get target(): T {
        if (this._target)
            return this._target
        throw ReferenceError("Target not set.")
    }
    /**
     * Set the target.
     */
    set target(value: T) {
        this._target = value
    }
}