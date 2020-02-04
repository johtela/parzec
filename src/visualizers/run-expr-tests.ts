import * as vis from 'litscript/lib/visualizer'
import * as le from 'lits-extras'

vis.registerVisualizer("run-expr-tests", le.runTests)

import '../test/exprtests'
