import { parseJson } from "./jsonparser";
import { readFileSync } from "fs";
import { expect } from "chai";

describe("Test simple file", () => {
    it("should succeed parsing 'test.json'", () => {
        let buf = readFileSync("testdata/test.json")
        let text = buf.toString()
        expect(text.length).greaterThan(0)
        let json1 = parseJson(text)
        let json2 = JSON.parse(text)
        expect(json1).to.deep.equal(json2)
    })
})