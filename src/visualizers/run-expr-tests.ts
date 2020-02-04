import * as vis from 'litscript/lib/visualizer'
import * as le from 'lits-extras'
import '../test/exprtests'

vis.registerVisualizer("run-expr-tests", le.runTests)