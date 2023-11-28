import { StyledElement } from 'litscript/lib/src/custom-elem'
import 'lits-extras/lib/test-runner'
import * as pz from '..'
import * as jp from '../test/jsonparser'
import '../test/jsontests'
import './run-json-tests.css'

export class JsonParser extends StyledElement {
    private textarea: HTMLTextAreaElement
    private result: HTMLDivElement

    constructor() {
        super("run-json-tests")
        this.body.classList.add("json-editor")
        this.textarea = document.createElement('textarea')
        this.textarea.cols = 40
        this.textarea.rows = 10
        this.result = document.createElement('div')
        this.result.classList.add("result")
        this.body.append(this.textarea, this.result)
    }
    
    protected override connect() {
        this.textarea.addEventListener("input",  _ => {
            try {
                this.result.innerText = JSON.stringify(jp.parseJson(
                    this.textarea.value), undefined, 2)
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

customElements.define("json-parser", JsonParser)