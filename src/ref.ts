export class Ref<T> {
    private _target: T | null = null

    constructor(value?: T) {
        if (value)
            this._target = value
    }

    get target(): T {
        if (this._target)
            return this._target
        throw ReferenceError("Target not set.")
    }

    set target(value: T) {
        this._target = value
    }
}