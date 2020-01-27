import { expect } from "chai"
import * as ep from "./exprparser"
import * as fc from "fast-check"
import * as th from "./test-helpers"
import * as pz from ".."

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
            let calcres = ep.evaluateExpression(expr);
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
            expect(() => ep.evaluateExpression(expr)).to.throw(pz.ParseError)
        })
    }
})

const arbNum = fc.integer(-1000, 1000).map(n => n.toString())
const arbOper = fc.constantFrom("+", "-", "*", "/")
const arbExpr = fc.letrec(tie => (
    {
        num: arbNum,
        oper: fc.tuple(tie('expr') as fc.Arbitrary<string>, arbOper, 
            tie('expr') as fc.Arbitrary<string>).map(t => 
                `${t[0]} ${t[1]} ${t[2]}`),
        par: tie('expr').map(e => "(" + e + ")"),
        expr: fc.oneof(tie('num'), tie('oper'), tie('par')) as 
            fc.Arbitrary<string>
    }
))

describe("Test arbitrary expressions", () =>
    th.check("Evaluate arbitrary expressions", 
        fc.property(arbExpr.expr, e => {
            let res1 = eval(e)
            let res2 = ep.evaluateExpression(e)
            expect(res1).to.equal(res2)
        })))
