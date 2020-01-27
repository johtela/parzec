import * as fc from "fast-check"

export function check<T>(desc: string, prop: fc.IProperty<T>) {
    it(desc, () => fc.assert(prop))
}