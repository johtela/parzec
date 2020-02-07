import * as vis from "litscript/lib/visualizer"
import * as le from 'lits-extras'
import * as pz from '..'
import * as jp from '../test/jsonparser'
import '../test/jsontests'
import './run-json-tests.less'

vis.registerVisualizer("run-json-tests", le.runTests)
vis.registerVisualizer("json-parser", parseJson)

function parseJson(params: string, parent: HTMLElement) {
    parent.classList.add("json-editor")
    let ta = document.createElement('textarea')
    ta.cols = 40
    ta.rows = 10
    let res = document.createElement('div')
    res.classList.add("result")
    parent.append(ta, res)
    ta.addEventListener("input",  _ => {
        try {
            res.innerText = JSON.stringify(jp.parseJson(ta.value))
        }
        catch(e) {
            if (e instanceof pz.ParseError)
                res.innerText = e.message
            else
                throw e
        }
    })
}