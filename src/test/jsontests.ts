import { parseJson } from "./jsonparser"
import { test } from "zora"
import * as fc from "fast-check"

test("Test arbitrary JSON data", t =>
    fc.assert(
        fc.property(fc.json(), str => {
            let obj1 = JSON.parse(str)
            let obj2 = parseJson(str)
            t.deepEqual(obj2, obj1)
        })))