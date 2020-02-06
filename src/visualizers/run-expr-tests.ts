import * as vis from "litscript/lib/visualizer"
import * as le from 'lits-extras'
import * as pz from '..'
import * as ep from '../test/exprparser'
import '../test/exprtests'
import './run-expr-tests.less'

vis.registerVisualizer("run-expr-tests", le.runTests)
vis.registerVisualizer("calculator", calculator)

function calculator(params: string, parent: HTMLElement) {
    parent.classList.add("calculator")
    let ta = document.createElement('input')
    let res = document.createElement('div')
    res.classList.add("result")
    parent.append(ta, res)
    ta.addEventListener("change",  _ => {
        try {
            res.innerText = ep.evaluateExpression(ta.value).toString()
        }
        catch(e) {
            if (e instanceof pz.ParseError)
                res.innerText = e.message
            else
                throw e
        }
    })
}