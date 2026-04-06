/**
 * # Run Tests in Command Line
 * 
 * Module that allows running unit test from command line usin Node.js.
 */
import { runTests } from 'lits-extras/lib/node-runner'
import './exprtests'
import './jsontests'
/**
 * Tests are defined in imported modules. We need to run them with `runTests`
 * function from `node-runner`.
 */
runTests().then(res => process.exit(res))