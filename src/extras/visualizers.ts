import * as vis from 'litscript/lib/visualizer'
import * as le from 'lits-extras'
import 'lits-extras/styles/dependency-diag.less'

vis.registerVisualizer("dependency-diag", le.createDependencyDiagram)
