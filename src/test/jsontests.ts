import { parseJson } from "./jsonparser"
import { readFileSync, readdirSync } from "fs"
import { expect } from "chai"
import * as fc from "fast-check"

function testParsingFile(fileName: string) {
    let buf = readFileSync(fileName);
    let text = buf.toString();
    expect(text.length).greaterThan(0);
    let json1 = parseJson(text);
    let json2 = JSON.parse(text);
    expect(json1).to.deep.equal(json2);
}

function check<T>(desc: string, prop: fc.IProperty<T>) {
    it(desc, () => fc.assert(prop))
}

describe("Test JSON file parsing", () => {
    let testdir = "testdata/"
    let files = readdirSync(testdir)
    for (let i = 0; i < files.length; i++) {
        const file = testdir + files[i];
        if (file.endsWith(".json"))
            it(`should succeed parsing '${file}'`, () =>
                testParsingFile(file))
    }
})

describe("Test arbitrary JSON data", () =>
    check("Serialize and parse arbitrary data", 
        fc.property(fc.json(), str => {
            let obj1 = JSON.parse(str)
            let obj2 = parseJson(str)
            expect(obj2).to.deep.equal(obj1)
        })))