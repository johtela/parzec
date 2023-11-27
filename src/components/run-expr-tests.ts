import { StyledElement } from 'litscript/lib/src/custom-elem'
import 'lits-extras/lib/test-runner'
import * as pz from '..'
import * as ep from '../test/exprparser'
import '../test/exprtests'
import './run-expr-tests.css'

export class CalculatorTests extends StyledElement {
    private input: HTMLInputElement
    private result: HTMLDivElement

    constructor() {
        super("run-expr-tests")
        this.body.classList.add("calculator")
        this.input = document.createElement('input')
        this.result = document.createElement('div')
        this.result.classList.add("result")
        this.body.append(this.input, this.result)
    }
    
    protected override connect() {
        this.input.addEventListener("change",  _ => {
            try {
                this.result.innerText = ep.evaluateExpression(this.input.value)
                    .toString()
            }
            catch(e) {
                if (e instanceof pz.ParseError)
                    this.result.innerText = e.message
                else
                    throw e
            }
        })
    }
}

customElements.define("calculator-tests", CalculatorTests)
