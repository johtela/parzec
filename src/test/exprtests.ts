import { evaluateExpression } from "./exprparser"
import { expect } from "chai"
import * as jsc from "jsverify"
import { ParseError } from "../error";

describe("Test parsing of predefined expressions", () => {
    let testset: [string, number][] = [
        ["1 + -1", 0],
        ["2 + 3 * 3", 11],
        ["1 - 1 / 2", 0.5],
        ["(1 - 1) / 2", 0],
        ["(1) + (((2)) + 3)", 6]
    ]
    for (let i = 0; i < testset.length; i++) {
        let [expr, res] = testset[i]
        it(`expression '${expr}' should evaluate to ${res}`, () => {
            let calcres = evaluateExpression(expr);
            expect(calcres).to.equal(res);
        })
    }
})

describe("Test failing expressions", () => {
    let testset: string[] = [
        "1 + ", 
        "2 ++ 3 * 3", 
        "- 1 - 1", 
        "",
        "a + 1" ]
    for (let i = 0; i < testset.length; i++) {
        let expr = testset[i]
        it(`expression '${expr}' should not parse`, () => {
            expect(() => evaluateExpression(expr)).to.throw(ParseError)
        })
    }
})
