import { test } from "lits-extras/lib/tester"
import * as ep from "./exprparser"
import * as fc from "fast-check"
import * as pz from ".."

test("Test parsing of predefined expressions", t => {
    let testset: string[] = [
        "1 + -1", 
        "2 + 3 * 3", 
        "1 - 1 / 2", 
        "(1 - 1) / 2",
        "(1) + (((2)) + )" ]
    for (let i = 0; i < testset.length; i++) {
        let expr = testset[i]
        let res = eval(expr)
        let calcres = ep.evaluateExpression(expr)
        t.equal(calcres, res, `expression '${expr}' should evaluate to ${res}`)
    }
})

test("Test failing expressions", t => {
    let testset: string[] = [
        "1 + ", 
        "2 ++ 3 * 3", 
        "- 1 - 1", 
        "",
        "a + 1" ]
        for (let i = 0; i < testset.length; i++) {
        let expr = testset[i]
        t.throws(() => ep.evaluateExpression(expr), pz.ParseError, 
            `expression '${expr}' should not parse`)
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

test("Test arbitrary expressions", t =>
    fc.assert( 
        fc.property(arbExpr.expr, e => {
            let res1 = eval(e)
            let res2 = ep.evaluateExpression(e)
            t.equal(res1, res2, `expression '${e}' should evaluate to ${res1}`)
        })))
