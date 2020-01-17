import { evaluateExpression } from "./exprparser"
import { expect } from "chai"
import * as fc from "fast-check"
import { ParseError } from "../error"

describe("Test parsing of predefined expressions", () => {
    let testset: string[] = [
        "1 + -1", 
        "2 + 3 * 3", 
        "1 - 1 / 2", 
        "(1 - 1) / 2",
        "(1) + (((2)) + 3)" ]
    for (let i = 0; i < testset.length; i++) {
        let expr = testset[i]
        let res = eval(expr)
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

const arbNum = fc.integer(-1000, 1000).map(n => n.toString())
const arbOper = fc.constantFrom(["+", "-", "*", "/"])
