/**
 * ---
 * {
 *  "modules": [ "./src/components/run-expr-tests.ts" ]
 * }
 * ---
 * 
 * # Testing the Expression Parser
 * 
 * The easiest way to test our parser is to manually input some expressions 
 * (press `Enter` to calculate).
 * 
 * <calculator-tests></calculator-tests>
 * 
 * But this becomes tedious soon, so let's write some automatic tests as well.
 * We use the `test` function from the **lits-extras** package.
 */
import { test } from "lits-extras/lib/tester"
import * as ep from "./exprparser"
import * as fc from "fast-check"
import * as pz from ".."
/**
 * First, let's test some valid expressions. Since our expressions are valid
 * in JavaScript too, we can use the `eval` function as the baseline.
 */
test("Test parsing of predefined expressions", async t => {
    let testset: string[] = [
        "1 + -1",
        "2 + 3 * 3",
        "1 - 1 / 2",
        "(1 - 1) / 2",
        "(1) + (((2)) + 3)"]
    for (let i = 0; i < testset.length; i++) {
        let expr = testset[i]
        let res = eval(expr)
        let calcres = ep.evaluateExpression(expr)
        t.equal(calcres, res, `expression '${expr}' should evaluate to ${res}`)
    }
})
/**
 * Then we test expression that should not be valid.
 */
test("Test failing expressions", async t => {
    let testset: string[] = [
        "1 + ",
        "2 ++ 3 * 3",
        "- 1 - 1",
        "",
        "a + 1"]
    for (let i = 0; i < testset.length; i++) {
        let expr = testset[i]
        t.throws(() => ep.evaluateExpression(expr), pz.ParseError,
            `expression '${expr}' should not parse`)
    }
})
/**
 * ## Property Based Tests
 * 
 * Coming up with test cases also becomes tedious quickly, so let's automate
 * test case generation with [fast-check][] library. This kind of approach is 
 * called _property based testing_, and it helps us get confidence that our
 * implementation works correctly.
 * 
 * [fast-check]: https://github.com/dubzzz/fast-check
 *
 * ### Running Tests
 * 
 * When we run the tests, we can see how crazy input data we get when we 
 * generate it with fast-check. It produces test cases we would very unlikely 
 * come up with ourselves. You can press `F5` to rerun the tests.
 * 
 * <test-runner name="Expression tests"></test-runner>
 * 
 * ### Generating Arbitrary Expressions
 * 
 * So, how do we generate these arbitrary input expressions? We construct them 
 * bottom-up starting from numbers and operators. Numbers we select randomly 
 * from range [-1000, 1000].
 */
const arbNum = fc.integer(-1000, 1000).map(n => n.toString())
/**
 * Operators are randomly selected from a predefined list.
 */
const arbOper = fc.constantFrom("+", "-", "*", "/")
/**
 * Since expression is a tree-like structure, we need to use a combinator that
 * constructs data recursively. In fast-check this combinator is called
 * `letrec`. It takes a recursive function that returns an object which 
 * properties generate arbitrary element of different types. We can descend to 
 * the next level in the expression tree by calling the `tie` function we get 
 * as an argument. 
 */
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
/**
 * ### Defining Properties
 * 
 * Armed with our arbitrary combinators, we can define the properties that our
 * data should have (hence the name "property based testing"). We do that simply
 * by checking that JS `eval` and our `evaluateExpression` functions return the
 * same result for all input data.
 */
test("Test arbitrary expressions", async t =>
    fc.assert(
        fc.property(arbExpr.expr, e => {
            let res1 = eval(e)
            let res2 = ep.evaluateExpression(e)
            t.equal(res1, res2, `expression '${e}' should evaluate to ${res1}`)
        })))
