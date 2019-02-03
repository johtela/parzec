import { evaluateExpression } from "./exprparser"
import { expect } from "chai"
import * as jsc from "jsverify"
import { ParseError } from "../error";

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

const arbNum = jsc.number.smap(n => n.toString(), s => Number(s))
const arbOper = jsc.elements(["+", "-", "*", "/"])
