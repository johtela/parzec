"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res3) => function __init() {
    return fn && (res3 = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res3;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // ../litscript/lib/src/custom-elem.js
  var require_custom_elem = __commonJS({
    "../litscript/lib/src/custom-elem.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StyledElement = exports.CustomElement = void 0;
      var CustomElement = class extends HTMLElement {
        /**
         * Constructor attaches the shadow DOM and clears the `connected` flag.
         */
        constructor() {
          super();
          this.root = this.attachShadow({ mode: "open" });
          this.connected = false;
        }
        /**
         * This method is called when the component is attached to DOM. It checks
         * whether we have already connected our functionality. If not we call the
         * abstract `connect` method and set the `connected` flag.
         */
        connectedCallback() {
          if (!this.connected) {
            this.connect();
            this.connected = true;
          }
        }
      };
      exports.CustomElement = CustomElement;
      var StyledElement2 = class extends CustomElement {
        /**
         * Constructor attaches the shadow DOM and creates `<link>` tag under it
         * that refers to the CSS file. Then it creates the `body` div under the
         * shadow root. You can add your own elements under it.
         */
        constructor(cssRoot) {
          super();
          let link = document.createElement("link");
          link.setAttribute("rel", "stylesheet");
          let src = document.currentScript.src;
          let path = src.substring(0, src.lastIndexOf("/"));
          link.setAttribute("href", `${path}/${cssRoot}.css`);
          this.root.appendChild(link);
          this.body = document.createElement("div");
          this.root.appendChild(this.body);
        }
      };
      exports.StyledElement = StyledElement2;
    }
  });

  // ../lits-extras/lib/test-reporter.js
  var require_test_reporter = __commonJS({
    "../lits-extras/lib/test-reporter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createReporter = void 0;
      function createTest(name) {
        return {
          name,
          passes: 0,
          fails: 0,
          duration: 0,
          tests: [],
          assertions: []
        };
      }
      function createReporter(name, render) {
        let rootTest = createTest(name);
        let teststack = [rootTest];
        return async (stream2) => {
          for await (let message of stream2) {
            switch (message.type) {
              case "TEST_START":
                let newtest = createTest(message.data.description);
                teststack[teststack.length - 1].tests.push(newtest);
                teststack.push(newtest);
                break;
              case "TEST_END":
                let ztest = message.data;
                let test = teststack.pop();
                test.pass = ztest.pass;
                test.passes = ztest.successCount;
                test.fails = ztest.failureCount;
                test.error = ztest.error;
                test.duration = ztest.executionTime;
                render(rootTest);
                break;
              case "ASSERTION":
                let zass = message.data;
                teststack[teststack.length - 1].assertions.push({
                  name: zass.description,
                  pass: zass.pass
                });
                break;
              case "BAIL_OUT":
                teststack[teststack.length - 1].error = message.data;
                render(rootTest);
                break;
            }
          }
        };
      }
      exports.createReporter = createReporter;
    }
  });

  // ../lits-extras/node_modules/zora/dist/bundle/index.js
  var require_bundle = __commonJS({
    "../lits-extras/node_modules/zora/dist/bundle/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var startTestMessage = (test2, offset) => ({
        type: "TEST_START",
        data: test2,
        offset
      });
      var assertionMessage = (assertion, offset) => ({
        type: "ASSERTION",
        data: assertion,
        offset
      });
      var endTestMessage = (test2, offset) => ({
        type: "TEST_END",
        data: test2,
        offset
      });
      var bailout = (error, offset) => ({
        type: "BAIL_OUT",
        data: error,
        offset
      });
      var delegateToCounter = (counter2) => (target) => Object.defineProperties(target, {
        skipCount: {
          get() {
            return counter2.skipCount;
          }
        },
        failureCount: {
          get() {
            return counter2.failureCount;
          }
        },
        successCount: {
          get() {
            return counter2.successCount;
          }
        },
        count: {
          get() {
            return counter2.count;
          }
        }
      });
      var counter = () => {
        let success = 0;
        let failure = 0;
        let skip2 = 0;
        return Object.defineProperties({
          update(assertion) {
            const { pass, skip: isSkipped } = assertion;
            if (isSkipped) {
              skip2++;
            } else if (!isAssertionResult(assertion)) {
              skip2 += assertion.skipCount;
              success += assertion.successCount;
              failure += assertion.failureCount;
            } else if (pass) {
              success++;
            } else {
              failure++;
            }
          }
        }, {
          successCount: {
            get() {
              return success;
            }
          },
          failureCount: {
            get() {
              return failure;
            }
          },
          skipCount: {
            get() {
              return skip2;
            }
          },
          count: {
            get() {
              return skip2 + success + failure;
            }
          }
        });
      };
      var defaultTestOptions = Object.freeze({
        offset: 0,
        skip: false,
        runOnly: false
      });
      var noop = () => {
      };
      var TesterPrototype = {
        [Symbol.asyncIterator]: async function* () {
          await this.routine;
          for (const assertion of this.assertions) {
            if (assertion[Symbol.asyncIterator]) {
              yield startTestMessage({ description: assertion.description }, this.offset);
              yield* assertion;
              if (assertion.error !== null) {
                this.error = assertion.error;
                this.pass = false;
                return;
              }
            }
            yield assertionMessage(assertion, this.offset);
            this.pass = this.pass && assertion.pass;
            this.counter.update(assertion);
          }
          return this.error !== null ? yield bailout(this.error, this.offset) : yield endTestMessage(this, this.offset);
        }
      };
      var testerLikeProvider = (BaseProto = TesterPrototype) => (assertions, routine, offset) => {
        const testCounter = counter();
        const withTestCounter = delegateToCounter(testCounter);
        let pass = true;
        return withTestCounter(Object.create(BaseProto, {
          routine: {
            value: routine
          },
          assertions: {
            value: assertions
          },
          offset: {
            value: offset
          },
          counter: {
            value: testCounter
          },
          length: {
            get() {
              return assertions.length;
            }
          },
          pass: {
            enumerable: true,
            get() {
              return pass;
            },
            set(val) {
              pass = val;
            }
          }
        }));
      };
      var testerFactory = testerLikeProvider();
      var tester = (description, spec, { offset = 0, skip: skip2 = false, runOnly = false } = defaultTestOptions) => {
        let executionTime = 0;
        let error = null;
        let done = false;
        const assertions = [];
        const collect = (item) => {
          if (done) {
            throw new Error(`test "${description}" 
tried to collect an assertion after it has run to its completion. 
You might have forgotten to wait for an asynchronous task to complete
------
${spec.toString()}
`);
          }
          assertions.push(item);
        };
        const specFunction = skip2 === true ? noop : function zora_spec_fn() {
          return spec(assert2(collect, offset, runOnly));
        };
        const testRoutine = async function() {
          try {
            const start2 = Date.now();
            const result = await specFunction();
            executionTime = Date.now() - start2;
            return result;
          } catch (e2) {
            error = e2;
          } finally {
            done = true;
          }
        }();
        return Object.defineProperties(testerFactory(assertions, testRoutine, offset), {
          error: {
            get() {
              return error;
            },
            set(val) {
              error = val;
            }
          },
          executionTime: {
            enumerable: true,
            get() {
              return executionTime;
            }
          },
          skip: {
            value: skip2
          },
          description: {
            enumerable: true,
            value: description
          }
        });
      };
      var fastDeepEqual = function equal2(a, b) {
        if (a === b)
          return true;
        if (a && b && typeof a == "object" && typeof b == "object") {
          if (a.constructor !== b.constructor)
            return false;
          var length, i2, keys;
          if (Array.isArray(a)) {
            length = a.length;
            if (length != b.length)
              return false;
            for (i2 = length; i2-- !== 0; )
              if (!equal2(a[i2], b[i2]))
                return false;
            return true;
          }
          if (a.constructor === RegExp)
            return a.source === b.source && a.flags === b.flags;
          if (a.valueOf !== Object.prototype.valueOf)
            return a.valueOf() === b.valueOf();
          if (a.toString !== Object.prototype.toString)
            return a.toString() === b.toString();
          keys = Object.keys(a);
          length = keys.length;
          if (length !== Object.keys(b).length)
            return false;
          for (i2 = length; i2-- !== 0; )
            if (!Object.prototype.hasOwnProperty.call(b, keys[i2]))
              return false;
          for (i2 = length; i2-- !== 0; ) {
            var key = keys[i2];
            if (!equal2(a[key], b[key]))
              return false;
          }
          return true;
        }
        return a !== a && b !== b;
      };
      var isAssertionResult = (result) => {
        return "operator" in result;
      };
      var specFnRegexp = /zora_spec_fn/;
      var zoraInternal = /zora\/dist\/bundle/;
      var filterStackLine = (l) => l && !zoraInternal.test(l) && !l.startsWith("Error") || specFnRegexp.test(l);
      var getAssertionLocation = () => {
        const err = new Error();
        const stack = (err.stack || "").split("\n").map((l) => l.trim()).filter(filterStackLine);
        const userLandIndex = stack.findIndex((l) => specFnRegexp.test(l));
        const stackline = userLandIndex >= 1 ? stack[userLandIndex - 1] : stack[0] || "N/A";
        return stackline.replace(/^at|^@/, "");
      };
      var assertMethodHook = (fn) => function(...args) {
        return this.collect(fn(...args));
      };
      var aliasMethodHook = (methodName) => function(...args) {
        return this[methodName](...args);
      };
      var unbindAssert = (target) => Object.fromEntries([...Object.keys(AssertPrototype), "collect"].map((methodName) => [methodName, (...args) => target[methodName](...args)]));
      var AssertPrototype = {
        equal: assertMethodHook((actual, expected, description = "should be equivalent") => ({
          pass: fastDeepEqual(actual, expected),
          actual,
          expected,
          description,
          operator: "equal"
          /* EQUAL */
        })),
        equals: aliasMethodHook("equal"),
        eq: aliasMethodHook("equal"),
        deepEqual: aliasMethodHook("equal"),
        same: aliasMethodHook("equal"),
        notEqual: assertMethodHook((actual, expected, description = "should not be equivalent") => ({
          pass: !fastDeepEqual(actual, expected),
          actual,
          expected,
          description,
          operator: "notEqual"
          /* NOT_EQUAL */
        })),
        notEquals: aliasMethodHook("notEqual"),
        notEq: aliasMethodHook("notEqual"),
        notDeepEqual: aliasMethodHook("notEqual"),
        is: assertMethodHook((actual, expected, description = "should be the same") => ({
          pass: Object.is(actual, expected),
          actual,
          expected,
          description,
          operator: "is"
          /* IS */
        })),
        isNot: assertMethodHook((actual, expected, description = "should not be the same") => ({
          pass: !Object.is(actual, expected),
          actual,
          expected,
          description,
          operator: "isNot"
          /* IS_NOT */
        })),
        notSame: aliasMethodHook("isNot"),
        ok: assertMethodHook((actual, description = "should be truthy") => ({
          pass: Boolean(actual),
          actual,
          expected: "truthy value",
          description,
          operator: "ok"
          /* OK */
        })),
        truthy: aliasMethodHook("ok"),
        notOk: assertMethodHook((actual, description = "should be falsy") => ({
          pass: !Boolean(actual),
          actual,
          expected: "falsy value",
          description,
          operator: "notOk"
          /* NOT_OK */
        })),
        falsy: aliasMethodHook("notOk"),
        fail: assertMethodHook((description = "fail called") => ({
          pass: false,
          actual: "fail called",
          expected: "fail not called",
          description,
          operator: "fail"
          /* FAIL */
        })),
        throws: assertMethodHook((func2, expected, description) => {
          let caught;
          let pass;
          let actual;
          if (typeof expected === "string") {
            [expected, description] = [description, expected];
          }
          try {
            func2();
          } catch (err) {
            caught = { error: err };
          }
          pass = caught !== void 0;
          actual = caught && caught.error;
          if (expected instanceof RegExp) {
            pass = expected.test(actual) || expected.test(actual && actual.message);
            actual = actual && actual.message || actual;
            expected = String(expected);
          } else if (typeof expected === "function" && caught) {
            pass = actual instanceof expected;
            actual = actual.constructor;
          }
          return {
            pass,
            actual,
            expected,
            description: description || "should throw",
            operator: "throws"
            /* THROWS */
          };
        }),
        doesNotThrow: assertMethodHook((func2, expected, description) => {
          let caught;
          if (typeof expected === "string") {
            [expected, description] = [description, expected];
          }
          try {
            func2();
          } catch (err) {
            caught = { error: err };
          }
          return {
            pass: caught === void 0,
            expected: "no thrown error",
            actual: caught && caught.error,
            operator: "doesNotThrow",
            description: description || "should not throw"
          };
        })
      };
      var assert2 = (collect, offset, runOnly = false) => {
        const actualCollect = (item) => {
          if (!item.pass) {
            item.at = getAssertionLocation();
          }
          collect(item);
          return item;
        };
        const test2 = (description, spec, opts) => {
          const options = Object.assign({}, defaultTestOptions, opts, { offset: offset + 1, runOnly });
          const subTest = tester(description, spec, options);
          collect(subTest);
          return subTest.routine;
        };
        const skip2 = (description, spec, opts) => {
          return test2(description, spec, Object.assign({}, opts, { skip: true }));
        };
        return {
          ...unbindAssert(Object.create(AssertPrototype, { collect: { value: actualCollect } })),
          test(description, spec, opts = {}) {
            if (runOnly) {
              return skip2(description, spec, opts);
            }
            return test2(description, spec, opts);
          },
          skip(description, spec = noop, opts = {}) {
            return skip2(description, spec, opts);
          },
          only(description, spec, opts = {}) {
            const specFn = runOnly === false ? (_) => {
              throw new Error(`Can not use "only" method when not in run only mode`);
            } : spec;
            return test2(description, specFn, opts);
          }
        };
      };
      var map = (fn) => async function* (stream2) {
        for await (const m of stream2) {
          yield fn(m);
        }
      };
      var flatten = map((m) => {
        m.offset = 0;
        return m;
      });
      var isAssertionResult$1 = (result) => {
        return "operator" in result;
      };
      var stringifySymbol = (key, value) => {
        if (typeof value === "symbol") {
          return value.toString();
        }
        return value;
      };
      var flatDiagnostic = ({ pass, description, ...rest }) => rest;
      var Tap = {
        print(message, offset = 0) {
          this.log(message.padStart(message.length + offset * 4));
        },
        printYAML(obj, offset = 0) {
          const YAMLOffset = offset + 0.5;
          this.print("---", YAMLOffset);
          for (const [prop, value] of Object.entries(obj)) {
            this.print(`${prop}: ${JSON.stringify(value, stringifySymbol)}`, YAMLOffset + 0.5);
          }
          this.print("...", YAMLOffset);
        },
        printComment(comment, offset = 0) {
          this.print(`# ${comment}`, offset);
        },
        printBailOut(message) {
          this.print("Bail out! Unhandled error.");
        },
        printTestStart(message) {
          const { data: { description }, offset } = message;
          this.printComment(description, offset);
        },
        printTestEnd(message) {
        },
        printAssertion(message) {
          const { data, offset } = message;
          const { pass, description } = data;
          const label = pass === true ? "ok" : "not ok";
          if (isAssertionResult$1(data)) {
            const id2 = this.nextId();
            this.print(`${label} ${id2} - ${description}`, offset);
            if (pass === false) {
              this.printYAML(flatDiagnostic(data), offset);
            }
          } else if (data.skip) {
            const id2 = this.nextId();
            this.print(`${pass ? "ok" : "not ok"} ${id2} - ${description} # SKIP`, offset);
          }
        },
        printSummary(endMessage) {
          this.print("", 0);
          this.printComment(endMessage.data.pass ? "ok" : "not ok", 0);
          this.printComment(`success: ${endMessage.data.successCount}`, 0);
          this.printComment(`skipped: ${endMessage.data.skipCount}`, 0);
          this.printComment(`failure: ${endMessage.data.failureCount}`, 0);
        },
        async report(stream2) {
          const src = flatten(stream2);
          let lastMessage = null;
          this.print("TAP version 13");
          for await (const message of src) {
            lastMessage = message;
            switch (message.type) {
              case "TEST_START":
                this.printTestStart(message);
                break;
              case "ASSERTION":
                this.printAssertion(message);
                break;
              case "BAIL_OUT":
                this.printBailOut(message);
                throw message.data;
            }
          }
          this.print(`1..${lastMessage.data.count}`, 0);
          this.printSummary(lastMessage);
        }
      };
      var factory = (log) => {
        let i2 = 0;
        return Object.create(Tap, {
          nextId: {
            enumerable: true,
            value: () => {
              return ++i2;
            }
          },
          log: { value: log }
        });
      };
      var indentedDiagnostic = ({ expected, pass, description, actual, operator, at = "N/A", ...rest }) => ({
        wanted: expected,
        found: actual,
        at,
        operator,
        ...rest
      });
      var id = function* () {
        let i2 = 0;
        while (true) {
          yield ++i2;
        }
      };
      var idGen = () => {
        let stack = [id()];
        return {
          [Symbol.iterator]() {
            return this;
          },
          next() {
            return stack[0].next();
          },
          fork() {
            stack.unshift(id());
          },
          merge() {
            stack.shift();
          }
        };
      };
      var IndentedTap = Object.assign({}, Tap, {
        printTestStart(message) {
          const { data: { description }, offset } = message;
          this.printComment(`Subtest: ${description}`, offset);
        },
        printAssertion(message) {
          const { data, offset } = message;
          const { pass, description } = data;
          const label = pass === true ? "ok" : "not ok";
          const id2 = this.nextId();
          if (isAssertionResult$1(data)) {
            this.print(`${label} ${id2} - ${description}`, offset);
            if (pass === false) {
              this.printYAML(indentedDiagnostic(data), offset);
            }
          } else {
            const comment = data.skip === true ? "SKIP" : `${data.executionTime}ms`;
            this.print(`${pass ? "ok" : "not ok"} ${id2} - ${description} # ${comment}`, message.offset);
          }
        },
        printTestEnd(message) {
          const length = message.data.length;
          const { offset } = message;
          this.print(`1..${length}`, offset);
        }
      });
      var factory$1 = (log) => {
        const id2 = idGen();
        return Object.create(IndentedTap, {
          nextId: {
            enumerable: true,
            value: () => {
              return id2.next().value;
            }
          },
          report: {
            enumerable: true,
            value: async function(stream2) {
              this.print("TAP version 13");
              let lastMessage = null;
              for await (const message of stream2) {
                lastMessage = message;
                switch (message.type) {
                  case "TEST_START":
                    id2.fork();
                    this.printTestStart(message);
                    break;
                  case "ASSERTION":
                    this.printAssertion(message);
                    break;
                  case "TEST_END":
                    id2.merge();
                    this.printTestEnd(message);
                    break;
                  case "BAIL_OUT":
                    this.printBailOut(message);
                    throw message.data;
                }
              }
              this.printSummary(lastMessage);
            }
          },
          log: { value: log }
        });
      };
      var report = (factory2) => (logger = console) => {
        const log = logger.log.bind(logger);
        return async (stream2) => factory2(log).report(stream2);
      };
      var tapReporter = report(factory);
      var indentedTapReporter = report(factory$1);
      var mochaTapLike = indentedTapReporter();
      var tapeTapLike = tapReporter();
      var harnessFactory = ({ runOnly = false, indent: indent2 = false } = {
        runOnly: false,
        indent: false
      }) => {
        const tests = [];
        const rootOffset = 0;
        const collect = (item) => tests.push(item);
        const api = assert2(collect, rootOffset, runOnly);
        let error = null;
        const factory2 = testerLikeProvider(Object.assign(api, TesterPrototype, {
          report: async function(reporter) {
            const rep = reporter || (indent2 ? mochaTapLike : tapeTapLike);
            return rep(this);
          }
        }));
        return Object.defineProperties(factory2(tests, Promise.resolve(), rootOffset), {
          error: {
            get() {
              return error;
            },
            set(val) {
              error = val;
            }
          }
        });
      };
      var findConfigurationFlag = (name) => {
        if (typeof process !== "undefined") {
          return process.env[name] === "true";
        } else if (typeof Deno !== "undefined") {
          return Deno.env.get(name) === "true";
        } else if (typeof window !== "undefined") {
          return Boolean(window[name]);
        }
        return false;
      };
      var defaultTestHarness = harnessFactory({
        runOnly: findConfigurationFlag("RUN_ONLY")
      });
      var autoStart = true;
      var indent = findConfigurationFlag("INDENT");
      var rootTest = defaultTestHarness.test.bind(defaultTestHarness);
      rootTest.indent = () => {
        console.warn('indent function is deprecated, use "INDENT" configuration flag instead');
        indent = true;
      };
      var test = rootTest;
      var skip = defaultTestHarness.skip.bind(defaultTestHarness);
      var only = defaultTestHarness.only.bind(defaultTestHarness);
      rootTest.skip = skip;
      var equal = defaultTestHarness.equal.bind(defaultTestHarness);
      var equals = equal;
      var eq = equal;
      var deepEqual = equal;
      var notEqual = defaultTestHarness.notEqual.bind(defaultTestHarness);
      var notEquals = notEqual;
      var notEq = notEqual;
      var notDeepEqual = notEqual;
      var is = defaultTestHarness.is.bind(defaultTestHarness);
      var same = is;
      var isNot = defaultTestHarness.isNot.bind(defaultTestHarness);
      var notSame = isNot;
      var ok = defaultTestHarness.ok.bind(defaultTestHarness);
      var truthy = ok;
      var notOk = defaultTestHarness.notOk.bind(defaultTestHarness);
      var falsy2 = notOk;
      var fail2 = defaultTestHarness.fail.bind(defaultTestHarness);
      var throws = defaultTestHarness.throws.bind(defaultTestHarness);
      var doesNotThrow = defaultTestHarness.doesNotThrow.bind(defaultTestHarness);
      var createHarness = (opts = {}) => {
        autoStart = false;
        return harnessFactory(opts);
      };
      var start = () => {
        if (autoStart) {
          defaultTestHarness.report(indent ? mochaTapLike : tapeTapLike);
        }
      };
      if (typeof window === "undefined") {
        setTimeout(start, 0);
      } else {
        window.addEventListener("load", start);
      }
      exports.AssertPrototype = AssertPrototype;
      exports.createHarness = createHarness;
      exports.deepEqual = deepEqual;
      exports.doesNotThrow = doesNotThrow;
      exports.eq = eq;
      exports.equal = equal;
      exports.equals = equals;
      exports.fail = fail2;
      exports.falsy = falsy2;
      exports.is = is;
      exports.isNot = isNot;
      exports.mochaTapLike = mochaTapLike;
      exports.notDeepEqual = notDeepEqual;
      exports.notEq = notEq;
      exports.notEqual = notEqual;
      exports.notEquals = notEquals;
      exports.notOk = notOk;
      exports.notSame = notSame;
      exports.ok = ok;
      exports.only = only;
      exports.same = same;
      exports.skip = skip;
      exports.tapeTapLike = tapeTapLike;
      exports.test = test;
      exports.throws = throws;
      exports.truthy = truthy;
    }
  });

  // ../lits-extras/lib/tester.js
  var require_tester = __commonJS({
    "../lits-extras/lib/tester.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.test = exports.getHarness = void 0;
      var zora = require_bundle();
      var harness = zora.createHarness();
      if (typeof window === "undefined")
        setTimeout(runTests, 0);
      function getHarness() {
        return harness;
      }
      exports.getHarness = getHarness;
      async function runTests() {
        try {
          await harness.report(zora.mochaTapLike);
        } catch (e2) {
          harness.pass = false;
          if (e2 instanceof Error) {
            console.error(e2.name + " exception thrown: " + e2.message);
            console.error(e2.stack);
          }
        }
        if (harness.pass)
          console.log("Tests PASSED");
        else
          console.log("Tests FAILED");
        process.exit(harness.pass ? 0 : 1);
      }
      function test(description, spec, options) {
        return harness.test(description, spec, options);
      }
      exports.test = test;
    }
  });

  // ../lits-extras/lib/test-runner.js
  var require_test_runner = __commonJS({
    "../lits-extras/lib/test-runner.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TestRunner = void 0;
      var tr = require_test_reporter();
      var tester = require_tester();
      var TestRunner = class extends HTMLElement {
        constructor() {
          super();
          this.styles = `
        .test-runner {
            font-family: var(--sans-font);
            padding: 10px;
            border-radius: 4px;
            overflow: auto;
        }    
        .test-runner .summary {
            font-weight: bolder;
        }
        .test-runner .summary .count {
            margin-left: 12px;
        }
        .test-runner pre {
            background-color: #fff0f0;
        }`;
          let shadow = this.attachShadow({ mode: "open" });
          let sheet = new CSSStyleSheet();
          sheet.replaceSync(this.styles);
          shadow.adoptedStyleSheets = [sheet];
          this.body = this.elem("div", "test-runner");
          shadow.appendChild(this.body);
          this.connected = false;
        }
        connectedCallback() {
          if (this.connected)
            return;
          this.connected = true;
          let name = this.getAttribute("name");
          this.runTests(name);
        }
        runTests(name) {
          tester.getHarness().report(tr.createReporter(name, (status) => {
            while (this.body.firstChild)
              this.body.firstChild.remove();
            this.body.appendChild(this.testStatus(status));
          }));
        }
        elem(tagName, cls, text) {
          let res3 = document.createElement(tagName);
          if (cls)
            res3.classList.add(cls);
          if (text)
            res3.innerText = text;
          return res3;
        }
        statusIcon(assertion) {
          return assertion.pass ? "\u2705" : "\u274C";
        }
        testStyle(test) {
          return test.pass ? "#f8fff8" : "#fff8f8";
        }
        testStatus(rootTest) {
          let vis = this.elem("div", "test-visualizer");
          vis.style.backgroundColor = this.testStyle(rootTest);
          let sum = this.elem("div", "summary", `${this.statusIcon(rootTest)} ${rootTest.name}`);
          sum.appendChild(this.elem("span", "count", `Pass: ${rootTest.passes}`));
          sum.appendChild(this.elem("span", "count", `Fail: ${rootTest.fails}`));
          vis.appendChild(sum);
          vis.appendChild(this.testList(rootTest.tests));
          return vis;
        }
        testList(tests) {
          let lst = this.elem("ol", "test-list");
          for (let i2 = 0; i2 < tests.length; i2++)
            lst.appendChild(this.test(tests[i2]));
          return lst;
        }
        assertion(assertion) {
          return this.elem("li", void 0, `${this.statusIcon(assertion)} ${assertion.name}`);
        }
        assertions(assertions) {
          let det = this.elem("details");
          det.appendChild(this.elem("summary", void 0, `${assertions.length} assertions`));
          let ol = this.elem("ol");
          for (let i2 = 0; i2 < assertions.length; i2++)
            ol.appendChild(this.assertion(assertions[i2]));
          det.appendChild(ol);
          return det;
        }
        test(test) {
          if (test.error)
            return this.bailedOutTest(test);
          let li = this.elem("li", void 0, `${this.statusIcon(test)} ${test.name} in ${test.duration}ms`);
          if (test.assertions)
            li.appendChild(this.assertions(test.assertions));
          if (test.tests)
            li.appendChild(this.testList(test.tests));
          return li;
        }
        bailedOutTest(test) {
          let res3 = this.elem("li");
          res3.innerHTML = `${this.statusIcon(test)} ${test.name} threw <b>${test.error.name}</b> exception:
            <br/><b>${test.error.message}</b>
            <pre>${test.error.stack}</pre>`;
          return res3;
        }
      };
      exports.TestRunner = TestRunner;
      customElements.define("test-runner", TestRunner);
    }
  });

  // src/ref.ts
  var Ref;
  var init_ref = __esm({
    "src/ref.ts"() {
      "use strict";
      Ref = class {
        /**
         * Constructing a reference. The target value is optional.
         */
        constructor(value) {
          this._target = null;
          if (value)
            this._target = value;
        }
        /**
         * Get the target of the reference. If no target is set, a 
         * `ReferenceError` is thrown.
         */
        get target() {
          if (this._target)
            return this._target;
          throw ReferenceError("Target not set.");
        }
        /**
         * Set the target.
         */
        set target(value) {
          this._target = value;
        }
      };
    }
  });

  // src/error.ts
  var ParseError;
  var init_error = __esm({
    "src/error.ts"() {
      "use strict";
      ParseError = class extends Error {
        constructor(source, position, found, expected = []) {
          super(`${source} error at position ${position + 1}.
	Found: "${found}"
	Expected: ${expected.map((s) => `"${s}"`).join(", ")}`);
          this.source = source;
          this.position = position;
          this.found = found;
          this.expected = expected;
        }
      };
    }
  });

  // src/input.ts
  var init_input = __esm({
    "src/input.ts"() {
      "use strict";
    }
  });

  // src/result.ts
  function joinExpected(result, other) {
    if (other.expected.length > 0)
      result.expected = result.expected.concat(other.expected);
  }
  function expectedAsCsv(result) {
    return result.expected.map((s) => `"${s}"`).join(", ");
  }
  function succeeded(pos, res3) {
    return {
      kind: "ok",
      position: pos,
      result: res3
    };
  }
  function failed(pos, fnd, exp = []) {
    return {
      kind: "fail",
      position: pos,
      found: fnd,
      expected: exp
    };
  }
  var init_result = __esm({
    "src/result.ts"() {
      "use strict";
    }
  });

  // src/utils.ts
  function escapeWhitespace(text) {
    return text.replace("\n", "\\n").replace("\r", "\\r").replace("	", "\\t");
  }
  var init_utils = __esm({
    "src/utils.ts"() {
      "use strict";
    }
  });

  // src/lexer.ts
  function lexerInput(text, lexer2, eof2) {
    return new LexerInput(text, lexer2, eof2);
  }
  var Token, Lexer, LexerInput;
  var init_lexer = __esm({
    "src/lexer.ts"() {
      "use strict";
      init_utils();
      init_error();
      Token = class {
        constructor(token2, text) {
          this.token = token2;
          this.text = text;
        }
        /**
         * We override the `toString` function so we can output a token 
         * to screen.
         */
        toString() {
          return this.text ? escapeWhitespace(this.text) : this.token;
        }
      };
      Lexer = class {
        /**
         * The constructor adds two flags to the regular expressions given as 
         * arguments. The `y` flag makes the search sticky so that it scans the
         * input string from the position indicated by the `lastIndex` property.
         * The `u` flag makes the search support unicode characters.
         */
        constructor(...tokens) {
          this.matchers = tokens.map((t2) => ({
            regex: new RegExp(t2[0], "yu"),
            token: t2[1]
          }));
        }
        /**
         * We check matchers one-by-one in the order they were given to
         * recognize the token in the given position. If none of the matchers
         * succeed, we return `null`.
         */
        matchToken(input, pos) {
          for (let i2 = 0; i2 < this.matchers.length; i2++) {
            let matcher = this.matchers[i2];
            matcher.regex.lastIndex = pos;
            let match = matcher.regex.exec(input);
            if (match != null)
              return new Token(matcher.token, match[0]);
          }
          return null;
        }
      };
      LexerInput = class {
        /**
         * Create an input stream for given string and lexer. Initialize the
         * instance variables.
         */
        constructor(input, lexer2, eof2) {
          this.input = input;
          this.lexer = lexer2;
          this.tokens = new Array(input.length);
          this.position = -1;
          this.eof = eof2;
          this.current = this.eof;
        }
        /**
         * The iterator implementation is fairly straightforward. We need to make 
         * sure that the state variables `position` and `current` are kept in sync 
         * while we advance in the input string. We must also do a lookup in the 
         * caché before calling the lexer to recognize the token. If the lexer finds 
         * a match, we update the caché. If the lexer cannot recognize the next 
         * token, we throw a `ParseError`.
         */
        next() {
          let pos = this.position;
          pos += this.tokens[pos] ? this.tokens[pos].text.length : 1;
          if (pos >= this.input.length)
            return this.eof;
          this.position = pos;
          let match = this.tokens[pos] || this.lexer.matchToken(this.input, pos);
          if (!match)
            throw new ParseError(
              "Lexer" /* Lexer */,
              pos,
              this.input.substr(pos, 10) + "...",
              ["<valid token>"]
            );
          this.tokens[pos] = match;
          this.current = match;
          return match;
        }
      };
    }
  });

  // src/parser.ts
  function tryParse(parser, input) {
    parserDebug.rulesEvaluated = 0;
    let res3 = parser.parse(input);
    if (parserDebug.debugging)
      console.info("Number of rules evaluated: " + parserDebug.rulesEvaluated);
    return res3;
  }
  function parse(parser, input) {
    var res3 = tryParse(parser, input);
    if (res3.kind == "fail")
      throw new ParseError(
        "Parsing" /* Parser */,
        res3.position,
        res3.found,
        res3.expected
      );
    return res3.result;
  }
  function mret(value) {
    return new Parser((input) => succeeded(input.position, value));
  }
  function fail(found, ...expected) {
    return new Parser((input) => failed(input.position, found, expected));
  }
  function satisfy(predicate) {
    return new Parser((input) => {
      let pos = input.position;
      let item = input.next();
      if (predicate(item))
        return succeeded(input.position, item);
      input.position = pos;
      return failed(input.position, `${item}`);
    });
  }
  function any(...parsers) {
    if (parsers.length == 0)
      throw Error("At least one parser must be given.");
    return new Parser((input) => {
      let res3 = null;
      let i2 = 0;
      let pos = input.position;
      do {
        let r = parsers[i2++].parse(input);
        if (r.kind == "ok")
          return r;
        if (r.position > pos)
          return r;
        if (res3 == null)
          res3 = r;
        else
          joinExpected(res3, r);
      } while (i2 < parsers.length);
      return res3;
    });
  }
  function forwardRef(parser) {
    return new Parser((input) => parser.target.parse(input));
  }
  function token(token2) {
    return satisfy((t2) => t2.token === token2);
  }
  function terminal(tok, name) {
    return token(tok).expect(name);
  }
  var Parser, parserDebug;
  var init_parser = __esm({
    "src/parser.ts"() {
      "use strict";
      init_result();
      init_utils();
      init_error();
      Parser = class _Parser {
        /**
         * Constructor wraps the parsing function.
         */
        constructor(parse2) {
          this.parse = parse2;
        }
        /**
         * The monadic bind that corresponds to Haskell's `>>=` operator. Runs 
         * `this` parser, and if it succeeds, feeds its result to the `binder` 
         * function that returns a new Parser. This is the basic operation that is 
         * used in other combinators to glue parsers together.
         */
        bind(binder) {
          return new _Parser((input) => {
            let pos = input.position;
            let res12 = this.parse(input);
            if (res12.kind == "ok") {
              let res22 = binder(res12.result).parse(input);
              if (res22.kind == "fail" && pos !== input.position)
                input.position = pos;
              return res22;
            }
            return res12;
          });
        }
        /**
         * The sequence operator. Runs `this` parser, and if it succeeds, runs the 
         * `other` parser ignoring the result of `this` one.
         */
        seq(other) {
          return this.bind((_) => other);
        }
        /**
         * Map result of the parser to another value. This function implements a 
         * [_functor_](https://en.wikipedia.org/wiki/Functor) which is a superclass 
         * of monad.
         */
        map(mapper) {
          return this.bind((x) => mret(mapper(x)));
        }
        /**
         * ## Conditional Parsing
         * 
         * The ordered choice operation. Creates a parser that first runs `this` 
         * parser, and if that fails, runs the `other` one. Corresponds to the `/` 
         * operation in [PEG grammars](https://en.wikipedia.org/wiki/Parsing_expression_grammar).
         */
        or(other) {
          return new _Parser((input) => {
            let pos = input.position;
            let res12 = this.parse(input);
            if (res12.kind == "ok")
              return res12;
            if (res12.position > pos)
              return res12;
            let res22 = other.parse(input);
            if (res22.kind == "ok")
              return res22;
            joinExpected(res22, res12);
            return res22;
          });
        }
        /**
         * Parse an optional value, if the parser fails then the default value is 
         * returned.
         */
        optional(defaultValue) {
          return this.or(mret(defaultValue));
        }
        /**
         * Parse an optional reference value, if the parser fails then null is 
         * returned.
         */
        optionalRef() {
          return this.or(mret(null));
        }
        /**
         * Runs parser and checks that it succeeds and that the result it returns
         * satisfies a given predicate.
         */
        where(predicate) {
          return this.bind((x) => predicate(x) ? mret(x) : fail(`${x}`, "predicate"));
        }
        /**
         * ## Parsing Multiple Items
         * 
         * Creates a parser that will run `this` parser zero or more times. The 
         * results of the input parser are added to an array.
         */
        zeroOrMore() {
          return new _Parser((input) => {
            let list = [];
            while (true) {
              let pos = input.position;
              let res3 = this.parse(input);
              if (res3.kind == "fail")
                return res3.position > pos ? res3 : succeeded(res3.position, list);
              list.push(res3.result);
            }
          });
        }
        /**
         * Creates a parser that runs `this` parser one or more times.
         */
        oneOrMore() {
          return new _Parser((input) => {
            let res3 = this.parse(input);
            if (res3.kind == "fail")
              return res3;
            let list = [res3.result];
            while (true) {
              let pos = input.position;
              res3 = this.parse(input);
              if (res3.kind == "fail")
                return res3.position > pos ? res3 : succeeded(res3.position, list);
              list.push(res3.result);
            }
          });
        }
        /**
         * Parsing succeeds if `this` parser succeeds from `min` to `max` times.
         */
        occurrences(min, max) {
          return this.zeroOrMore().bind((list) => {
            let cnt = list.length;
            return cnt >= min && cnt <= max ? mret(list) : fail(`${cnt} occurrences`, `${min}-${max} occurrences`);
          });
        }
        /**
         * ## Lookahead & Backtracking
         * 
         * Check that `this` parser succeeds without consuming any input. 
         * Corresponds to the `&` operator in PEG grammars.
         */
        and() {
          return new _Parser((input) => {
            let pos = input.position;
            let res3 = this.parse(input);
            input.position = pos;
            return res3;
          });
        }
        /**
         * Check that `this` parser fails without consuming any input. Corresponds 
         * to the `!` operator in PEG grammars.
         */
        not() {
          return new _Parser((input) => {
            let pos = input.position;
            let res3 = this.parse(input);
            input.position = pos;
            if (res3.kind == "ok") {
              let found = `${res3.result}`;
              return failed(res3.position, found, ["not " + found]);
            }
            return succeeded(res3.position, void 0);
          });
        }
        /**
         * Bactrack to the current input position, even if the given parser fails
         * and has advanced the input position. Normally we do not bactrack when a
         * parser has advanced in the input. Doing so would loose the position where
         * the parsing failed and make error messages more vague. Sometimes, 
         * however, we need more input lookahead. In these cases, you can use the 
         * backtrack operation to retry the next rule.
         */
        backtrack() {
          return new _Parser((input) => {
            let pos = input.position;
            let res3 = this.parse(input);
            if (res3.kind == "fail" && res3.position > pos)
              res3.position = pos;
            return res3;
          });
        }
        /**
         * ## Error Reporting and Debugging
         * 
         * Give a human-readable name to the "thing" that the given parser matches. 
         * This name is reported as expected value, if the parsing fails.
         */
        expect(expected) {
          if (!parserDebug.errorMessages)
            return this;
          let resParser = new _Parser((input) => {
            let res3 = this.parse(input);
            if (res3.kind == "fail")
              res3.expected.push(expected);
            return res3;
          });
          return parserDebug.debugging ? resParser.trace(expected) : resParser;
        }
        /**
         * Attach debugging information to a parser. To trace which rules are 
         * triggered during parsing, you can add debugging info to any parser. This 
         * combinator produces a hierarchical tree of parser invocations which 
         * includes information about input symbol and its position. If debugging 
         * is disabled, this function does nothing.
         */
        trace(ruleName) {
          if (!parserDebug.debugging)
            return this;
          return new _Parser((input) => {
            parserDebug.write(`${ruleName} called with input '${input.current}'.`);
            parserDebug.indent();
            let res3 = this.parse(input);
            parserDebug.rulesEvaluated++;
            parserDebug.unindent();
            parserDebug.write((res3.kind == "ok" ? `${ruleName} SUCCEEDED with value '${escapeWhitespace(`${res3.result}`)}'` : `${ruleName} FAILED with value '${escapeWhitespace(`${res3.found}`)}'. Expected values: ${expectedAsCsv(res3)}`) + ` at position ${res3.position}`);
            return res3;
          });
        }
      };
      parserDebug = {
        /** 
         * When `debugging` flag is on parsers count the number of rules evaluated 
         * during their operation. The `rulesEvaluated` field contains this 
         * information. 
         */
        debugging: false,
        rulesEvaluated: 0,
        /**
         * If errorMessages flag is turned off, the expected information will not be 
         * available in parse errors. This speeds up the parsing nominally.
         */
        errorMessages: true,
        /**
         * The current indentation level in the debugging output is stored in this 
         * field.
         */
        indentation: 0,
        /**
         * Indent the debug output by one level.
         */
        indent() {
          this.indentation++;
        },
        /**
         * Unndent the debug output by one level.
         */
        unindent() {
          this.indentation--;
        },
        /**
         * Write a string to the debug output.
         */
        write(text) {
          let tabs = "  ".repeat(this.indentation);
          console.log(tabs + text);
        }
      };
    }
  });

  // src/arrayparsers.ts
  function operators(...ops) {
    return any(...ops.map(([p, o]) => p.map((_) => o)));
  }
  var init_arrayparsers = __esm({
    "src/arrayparsers.ts"() {
      "use strict";
      init_parser();
      Parser.prototype.oneOrMoreSeparatedBy = function(separator) {
        return this.bind(
          (x) => separator.seq(this).zeroOrMore().bind(
            (xs) => mret([x].concat(xs))
          )
        );
      };
      Parser.prototype.zeroOrMoreSeparatedBy = function(separator) {
        return this.oneOrMoreSeparatedBy(separator).or(mret([]));
      };
      Parser.prototype.followedBy = function(after) {
        return this.bind((p) => after.bind((_) => mret(p)));
      };
      Parser.prototype.surroundedBy = function(surround) {
        return surround.bind(
          (o) => this.bind(
            (p) => surround.bind(
              (c) => mret(p)
            )
          )
        );
      };
      Parser.prototype.bracketedBy = function(open, close) {
        return open.bind(
          (o) => this.bind(
            (p) => close.bind(
              (c) => mret(p)
            )
          )
        );
      };
      Parser.prototype.chainOneOrMore = function(operation) {
        return this.bind(
          (x) => operation.bind(
            (f) => this.bind(
              (y) => mret([f, y])
            )
          ).zeroOrMore().bind(
            (fys) => mret(fys.reduce((z, [f, y]) => f(z, y), x))
          )
        );
      };
      Parser.prototype.chainZeroOrMore = function(operation, value) {
        return this.chainOneOrMore(operation).or(mret(value));
      };
    }
  });

  // src/index.ts
  var init_src = __esm({
    "src/index.ts"() {
      "use strict";
      init_ref();
      init_error();
      init_input();
      init_result();
      init_error();
      init_lexer();
      init_parser();
      init_arrayparsers();
      init_utils();
    }
  });

  // src/test/exprparser.ts
  function evaluateExpression(expression) {
    return parse(rootExpr, lexerInput(
      expression,
      lexer,
      new Token(8 /* EOF */, "<end of input>")
    ));
  }
  var lexer, optws, number, openParen, closeParen, plus, minus, multiply, divide, eof, addop, mulop, term, expr2, factor, rootExpr;
  var init_exprparser = __esm({
    "src/test/exprparser.ts"() {
      "use strict";
      init_src();
      parserDebug.debugging = false;
      lexer = new Lexer(
        [/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/, 0 /* Number */],
        [/\(/, 1 /* OpenParen */],
        [/\)/, 2 /* CloseParen */],
        [/\+/, 3 /* Plus */],
        [/-/, 4 /* Minus */],
        [/\*/, 5 /* Multiply */],
        [/\//, 6 /* Divide */],
        [/[\t\n\r ]+/, 7 /* Whitespace */]
      );
      optws = terminal(7 /* Whitespace */, "<whitespace>").optionalRef();
      number = terminal(0 /* Number */, "<number>").map((t2) => Number(t2.text)).followedBy(optws);
      openParen = terminal(1 /* OpenParen */, "(").followedBy(optws);
      closeParen = terminal(2 /* CloseParen */, ")").followedBy(optws);
      plus = terminal(3 /* Plus */, "+").followedBy(optws);
      minus = terminal(4 /* Minus */, "-").followedBy(optws);
      multiply = terminal(5 /* Multiply */, "*").followedBy(optws);
      divide = terminal(6 /* Divide */, "/").followedBy(optws);
      eof = terminal(8 /* EOF */, "<end of input>");
      addop = operators(
        [plus, (a, b) => a + b],
        [minus, (a, b) => a - b]
      );
      mulop = operators(
        [multiply, (a, b) => a * b],
        [divide, (a, b) => a / b]
      );
      term = new Ref();
      expr2 = forwardRef(term).chainOneOrMore(addop);
      factor = expr2.bracketedBy(openParen, closeParen).or(number);
      term.target = factor.chainOneOrMore(mulop);
      rootExpr = optws.seq(expr2).followedBy(eof);
    }
  });

  // node_modules/fast-check/lib/esm/check/precondition/PreconditionFailure.js
  var PreconditionFailure;
  var init_PreconditionFailure = __esm({
    "node_modules/fast-check/lib/esm/check/precondition/PreconditionFailure.js"() {
      PreconditionFailure = class _PreconditionFailure extends Error {
        constructor(interruptExecution = false) {
          super();
          this.interruptExecution = interruptExecution;
          this.footprint = _PreconditionFailure.SharedFootPrint;
        }
        static isFailure(err) {
          return err != null && err.footprint === _PreconditionFailure.SharedFootPrint;
        }
      };
      PreconditionFailure.SharedFootPrint = Symbol("fast-check/PreconditionFailure");
    }
  });

  // node_modules/fast-check/lib/esm/check/precondition/Pre.js
  var init_Pre = __esm({
    "node_modules/fast-check/lib/esm/check/precondition/Pre.js"() {
      init_PreconditionFailure();
    }
  });

  // node_modules/fast-check/lib/esm/stream/StreamHelpers.js
  function nilHelper() {
    return Nil.nil;
  }
  function* mapHelper(g, f) {
    for (const v of g) {
      yield f(v);
    }
  }
  function* flatMapHelper(g, f) {
    for (const v of g) {
      yield* f(v);
    }
  }
  function* filterHelper(g, f) {
    for (const v of g) {
      if (f(v)) {
        yield v;
      }
    }
  }
  function* takeNHelper(g, n) {
    for (let i2 = 0; i2 < n; ++i2) {
      const cur = g.next();
      if (cur.done) {
        break;
      }
      yield cur.value;
    }
  }
  function* takeWhileHelper(g, f) {
    let cur = g.next();
    while (!cur.done && f(cur.value)) {
      yield cur.value;
      cur = g.next();
    }
  }
  function* joinHelper(g, others) {
    for (let cur = g.next(); !cur.done; cur = g.next()) {
      yield cur.value;
    }
    for (const s of others) {
      for (let cur = s.next(); !cur.done; cur = s.next()) {
        yield cur.value;
      }
    }
  }
  var Nil;
  var init_StreamHelpers = __esm({
    "node_modules/fast-check/lib/esm/stream/StreamHelpers.js"() {
      Nil = class {
        [Symbol.iterator]() {
          return this;
        }
        next(value) {
          return { value, done: true };
        }
      };
      Nil.nil = new Nil();
    }
  });

  // node_modules/fast-check/lib/esm/stream/Stream.js
  function stream(g) {
    return new Stream(g);
  }
  var Stream;
  var init_Stream = __esm({
    "node_modules/fast-check/lib/esm/stream/Stream.js"() {
      init_StreamHelpers();
      Stream = class _Stream {
        constructor(g) {
          this.g = g;
        }
        static nil() {
          return new _Stream(nilHelper());
        }
        static of(...elements) {
          return new _Stream(elements[Symbol.iterator]());
        }
        next() {
          return this.g.next();
        }
        [Symbol.iterator]() {
          return this.g;
        }
        map(f) {
          return new _Stream(mapHelper(this.g, f));
        }
        flatMap(f) {
          return new _Stream(flatMapHelper(this.g, f));
        }
        dropWhile(f) {
          let foundEligible = false;
          function* helper(v) {
            if (foundEligible || !f(v)) {
              foundEligible = true;
              yield v;
            }
          }
          return this.flatMap(helper);
        }
        drop(n) {
          let idx = 0;
          function helper() {
            return idx++ < n;
          }
          return this.dropWhile(helper);
        }
        takeWhile(f) {
          return new _Stream(takeWhileHelper(this.g, f));
        }
        take(n) {
          return new _Stream(takeNHelper(this.g, n));
        }
        filter(f) {
          return new _Stream(filterHelper(this.g, f));
        }
        every(f) {
          for (const v of this.g) {
            if (!f(v)) {
              return false;
            }
          }
          return true;
        }
        has(f) {
          for (const v of this.g) {
            if (f(v)) {
              return [true, v];
            }
          }
          return [false, null];
        }
        join(...others) {
          return new _Stream(joinHelper(this.g, others));
        }
        getNthOrLast(nth) {
          let remaining = nth;
          let last = null;
          for (const v of this.g) {
            if (remaining-- === 0)
              return v;
            last = v;
          }
          return last;
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/check/symbols.js
  function hasCloneMethod(instance) {
    return instance !== null && (typeof instance === "object" || typeof instance === "function") && cloneMethod in instance && typeof instance[cloneMethod] === "function";
  }
  function cloneIfNeeded(instance) {
    return hasCloneMethod(instance) ? instance[cloneMethod]() : instance;
  }
  var cloneMethod;
  var init_symbols = __esm({
    "node_modules/fast-check/lib/esm/check/symbols.js"() {
      cloneMethod = Symbol("fast-check/cloneMethod");
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/Shrinkable.js
  var Shrinkable;
  var init_Shrinkable = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/definition/Shrinkable.js"() {
      init_Stream();
      init_symbols();
      Shrinkable = class _Shrinkable {
        constructor(value_, shrink = () => Stream.nil(), customGetValue = void 0) {
          this.value_ = value_;
          this.shrink = shrink;
          this.hasToBeCloned = customGetValue !== void 0 || hasCloneMethod(value_);
          this.readOnce = false;
          if (this.hasToBeCloned) {
            Object.defineProperty(this, "value", { get: customGetValue !== void 0 ? customGetValue : this.getValue });
          } else {
            this.value = value_;
          }
        }
        getValue() {
          if (!this.readOnce) {
            this.readOnce = true;
            return this.value_;
          }
          return this.value_[cloneMethod]();
        }
        applyMapper(mapper) {
          if (this.hasToBeCloned) {
            const out = mapper(this.value);
            if (out instanceof Object) {
              out[cloneMethod] = () => this.applyMapper(mapper);
            }
            return out;
          }
          return mapper(this.value);
        }
        map(mapper) {
          return new _Shrinkable(this.applyMapper(mapper), () => this.shrink().map((v) => v.map(mapper)));
        }
        filter(refinement) {
          const refinementOnShrinkable = (s) => {
            return refinement(s.value_);
          };
          return new _Shrinkable(this.value, () => this.shrink().filter(refinementOnShrinkable).map((v) => v.filter(refinement)));
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/Arbitrary.js
  function assertIsArbitrary(instance) {
    if (typeof instance !== "object" || instance === null || !("generate" in instance)) {
      throw new Error("Unexpected value received: not an instance of Arbitrary");
    }
  }
  var Arbitrary, ChainArbitrary, MapArbitrary, FilterArbitrary, NoShrinkArbitrary, NoBiasArbitrary;
  var init_Arbitrary = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/definition/Arbitrary.js"() {
      init_Shrinkable();
      Arbitrary = class {
        filter(refinement) {
          return new FilterArbitrary(this, refinement);
        }
        map(mapper) {
          return new MapArbitrary(this, mapper);
        }
        chain(fmapper) {
          return new ChainArbitrary(this, fmapper);
        }
        noShrink() {
          return new NoShrinkArbitrary(this);
        }
        withBias(_freq) {
          return this;
        }
        noBias() {
          return new NoBiasArbitrary(this);
        }
      };
      ChainArbitrary = class _ChainArbitrary extends Arbitrary {
        constructor(arb, fmapper) {
          super();
          this.arb = arb;
          this.fmapper = fmapper;
        }
        generate(mrng) {
          const clonedMrng = mrng.clone();
          const src = this.arb.generate(mrng);
          const dst = this.fmapper(src.value).generate(mrng);
          return _ChainArbitrary.shrinkChain(clonedMrng, src, dst, this.fmapper);
        }
        withBias(freq) {
          return this.arb.withBias(freq).chain((t2) => this.fmapper(t2).withBias(freq));
        }
        static shrinkChain(mrng, src, dst, fmapper) {
          return new Shrinkable(dst.value, () => src.shrink().map((v) => _ChainArbitrary.shrinkChain(mrng.clone(), v, fmapper(v.value).generate(mrng.clone()), fmapper)).join(dst.shrink()));
        }
      };
      MapArbitrary = class extends Arbitrary {
        constructor(arb, mapper) {
          super();
          this.arb = arb;
          this.mapper = mapper;
        }
        generate(mrng) {
          return this.arb.generate(mrng).map(this.mapper);
        }
        withBias(freq) {
          return this.arb.withBias(freq).map(this.mapper);
        }
      };
      FilterArbitrary = class extends Arbitrary {
        constructor(arb, refinement) {
          super();
          this.arb = arb;
          this.refinement = refinement;
        }
        generate(mrng) {
          let g = this.arb.generate(mrng);
          while (!this.refinementOnShrinkable(g)) {
            g = this.arb.generate(mrng);
          }
          return g.filter(this.refinement);
        }
        withBias(freq) {
          return this.arb.withBias(freq).filter(this.refinement);
        }
        refinementOnShrinkable(s) {
          return this.refinement(s.value);
        }
      };
      NoShrinkArbitrary = class extends Arbitrary {
        constructor(arb) {
          super();
          this.arb = arb;
        }
        generate(mrng) {
          return new Shrinkable(this.arb.generate(mrng).value);
        }
        withBias(freq) {
          return this.arb.withBias(freq).noShrink();
        }
      };
      NoBiasArbitrary = class extends Arbitrary {
        constructor(arb) {
          super();
          this.arb = arb;
        }
        generate(mrng) {
          return this.arb.generate(mrng);
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/ArbitraryWithContextualShrink.js
  function removeContextFromContextualValue(contextualValue) {
    return contextualValue[0];
  }
  var ArbitraryWithContextualShrink;
  var init_ArbitraryWithContextualShrink = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/definition/ArbitraryWithContextualShrink.js"() {
      init_Arbitrary();
      init_Shrinkable();
      ArbitraryWithContextualShrink = class extends Arbitrary {
        contextualShrinkableFor(value, context2) {
          return new Shrinkable(value, () => this.contextualShrink(value, context2).map((contextualValue) => this.contextualShrinkableFor(contextualValue[0], contextualValue[1])));
        }
        shrink(value, shrunkOnce) {
          const context2 = shrunkOnce === true ? this.shrunkOnceContext() : void 0;
          return this.contextualShrink(value, context2).map(removeContextFromContextualValue);
        }
        shrinkableFor(value, shrunkOnce) {
          return new Shrinkable(value, () => {
            return this.shrink(value, shrunkOnce).map((value2) => this.shrinkableFor(value2, true));
          });
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/NextValue.js
  var NextValue;
  var init_NextValue = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/definition/NextValue.js"() {
      init_symbols();
      NextValue = class {
        constructor(value_, context2, customGetValue = void 0) {
          this.value_ = value_;
          this.context = context2;
          this.hasToBeCloned = customGetValue !== void 0 || hasCloneMethod(value_);
          this.readOnce = false;
          if (this.hasToBeCloned) {
            Object.defineProperty(this, "value", { get: customGetValue !== void 0 ? customGetValue : this.getValue });
          } else {
            this.value = value_;
          }
        }
        getValue() {
          if (this.hasToBeCloned) {
            if (!this.readOnce) {
              this.readOnce = true;
              return this.value_;
            }
            return this.value_[cloneMethod]();
          }
          return this.value_;
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/NextArbitrary.js
  function assertIsNextArbitrary(instance) {
    if (typeof instance !== "object" || instance === null || !("generate" in instance) || !("shrink" in instance) || "shrinkableFor" in instance) {
      throw new Error("Unexpected value received: not an instance of NextArbitrary");
    }
  }
  var NextArbitrary, ChainArbitrary2, MapArbitrary2, FilterArbitrary2, NoShrinkArbitrary2, NoBiasArbitrary2;
  var init_NextArbitrary = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/definition/NextArbitrary.js"() {
      init_Stream();
      init_symbols();
      init_NextValue();
      NextArbitrary = class {
        filter(refinement) {
          return new FilterArbitrary2(this, refinement);
        }
        map(mapper, unmapper) {
          return new MapArbitrary2(this, mapper, unmapper);
        }
        chain(chainer) {
          return new ChainArbitrary2(this, chainer);
        }
        noShrink() {
          return new NoShrinkArbitrary2(this);
        }
        noBias() {
          return new NoBiasArbitrary2(this);
        }
      };
      ChainArbitrary2 = class extends NextArbitrary {
        constructor(arb, chainer) {
          super();
          this.arb = arb;
          this.chainer = chainer;
        }
        generate(mrng, biasFactor) {
          const clonedMrng = mrng.clone();
          const src = this.arb.generate(mrng, biasFactor);
          return this.valueChainer(src, mrng, clonedMrng, biasFactor);
        }
        canShrinkWithoutContext(value) {
          return false;
        }
        shrink(value, context2) {
          if (this.isSafeContext(context2)) {
            return (!context2.stoppedForOriginal ? this.arb.shrink(context2.originalValue, context2.originalContext).map((v) => this.valueChainer(v, context2.clonedMrng.clone(), context2.clonedMrng, context2.originalBias)) : Stream.nil()).join(context2.chainedArbitrary.shrink(value, context2.chainedContext).map((dst) => {
              const newContext = Object.assign(Object.assign({}, context2), { chainedContext: dst.context, stoppedForOriginal: true });
              return new NextValue(dst.value_, newContext);
            }));
          }
          return Stream.nil();
        }
        valueChainer(v, generateMrng, clonedMrng, biasFactor) {
          const chainedArbitrary = this.chainer(v.value_);
          const dst = chainedArbitrary.generate(generateMrng, biasFactor);
          const context2 = {
            originalBias: biasFactor,
            originalValue: v.value_,
            originalContext: v.context,
            stoppedForOriginal: false,
            chainedArbitrary,
            chainedContext: dst.context,
            clonedMrng
          };
          return new NextValue(dst.value_, context2);
        }
        isSafeContext(context2) {
          return context2 != null && typeof context2 === "object" && "originalBias" in context2 && "originalValue" in context2 && "originalContext" in context2 && "stoppedForOriginal" in context2 && "chainedArbitrary" in context2 && "chainedContext" in context2 && "clonedMrng" in context2;
        }
      };
      MapArbitrary2 = class extends NextArbitrary {
        constructor(arb, mapper, unmapper) {
          super();
          this.arb = arb;
          this.mapper = mapper;
          this.unmapper = unmapper;
          this.bindValueMapper = this.valueMapper.bind(this);
        }
        generate(mrng, biasFactor) {
          const g = this.arb.generate(mrng, biasFactor);
          return this.valueMapper(g);
        }
        canShrinkWithoutContext(value) {
          if (this.unmapper !== void 0) {
            try {
              const unmapped = this.unmapper(value);
              return this.arb.canShrinkWithoutContext(unmapped);
            } catch (_err) {
              return false;
            }
          }
          return false;
        }
        shrink(value, context2) {
          if (this.isSafeContext(context2)) {
            return this.arb.shrink(context2.originalValue, context2.originalContext).map(this.bindValueMapper);
          }
          if (this.unmapper !== void 0) {
            const unmapped = this.unmapper(value);
            return this.arb.shrink(unmapped, void 0).map(this.bindValueMapper);
          }
          return Stream.nil();
        }
        mapperWithCloneIfNeeded(v) {
          const sourceValue = v.value;
          const mappedValue = this.mapper(sourceValue);
          if (v.hasToBeCloned && (typeof mappedValue === "object" && mappedValue !== null || typeof mappedValue === "function") && Object.isExtensible(mappedValue)) {
            Object.defineProperty(mappedValue, cloneMethod, { get: () => () => this.mapperWithCloneIfNeeded(v)[0] });
          }
          return [mappedValue, sourceValue];
        }
        valueMapper(v) {
          const [mappedValue, sourceValue] = this.mapperWithCloneIfNeeded(v);
          const context2 = { originalValue: sourceValue, originalContext: v.context };
          return new NextValue(mappedValue, context2);
        }
        isSafeContext(context2) {
          return context2 != null && typeof context2 === "object" && "originalValue" in context2 && "originalContext" in context2;
        }
      };
      FilterArbitrary2 = class extends NextArbitrary {
        constructor(arb, refinement) {
          super();
          this.arb = arb;
          this.refinement = refinement;
          this.bindRefinementOnValue = this.refinementOnValue.bind(this);
        }
        generate(mrng, biasFactor) {
          while (true) {
            const g = this.arb.generate(mrng, biasFactor);
            if (this.refinementOnValue(g)) {
              return g;
            }
          }
        }
        canShrinkWithoutContext(value) {
          return this.arb.canShrinkWithoutContext(value) && this.refinement(value);
        }
        shrink(value, context2) {
          return this.arb.shrink(value, context2).filter(this.bindRefinementOnValue);
        }
        refinementOnValue(v) {
          return this.refinement(v.value);
        }
      };
      NoShrinkArbitrary2 = class extends NextArbitrary {
        constructor(arb) {
          super();
          this.arb = arb;
        }
        generate(mrng, biasFactor) {
          return this.arb.generate(mrng, biasFactor);
        }
        canShrinkWithoutContext(value) {
          return this.arb.canShrinkWithoutContext(value);
        }
        shrink(_value, _context) {
          return Stream.nil();
        }
        noShrink() {
          return this;
        }
      };
      NoBiasArbitrary2 = class extends NextArbitrary {
        constructor(arb) {
          super();
          this.arb = arb;
        }
        generate(mrng, _biasFactor) {
          return this.arb.generate(mrng, void 0);
        }
        canShrinkWithoutContext(value) {
          return this.arb.canShrinkWithoutContext(value);
        }
        shrink(value, context2) {
          return this.arb.shrink(value, context2);
        }
        noBias() {
          return this;
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/ConverterToNext.js
  function fromShrinkableToNextValue(g) {
    if (!g.hasToBeCloned) {
      return new NextValue(g.value_, g);
    }
    return new NextValue(g.value_, g, () => g.value);
  }
  var _a, identifier, ConverterToNext;
  var init_ConverterToNext = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/definition/ConverterToNext.js"() {
      init_Stream();
      init_ConverterFromNext();
      init_NextArbitrary();
      init_NextValue();
      identifier = "__ConverterToNext__";
      ConverterToNext = class _ConverterToNext extends NextArbitrary {
        constructor(arb) {
          super();
          this.arb = arb;
          this[_a] = true;
        }
        static isConverterToNext(arb) {
          return identifier in arb;
        }
        static convertIfNeeded(arb) {
          if (ConverterFromNext.isConverterFromNext(arb))
            return arb.arb;
          else
            return new _ConverterToNext(arb);
        }
        generate(mrng, biasFactor) {
          const g = biasFactor !== void 0 ? this.arb.withBias(biasFactor).generate(mrng) : this.arb.generate(mrng);
          return fromShrinkableToNextValue(g);
        }
        canShrinkWithoutContext(_value) {
          return false;
        }
        shrink(_value, context2) {
          if (this.isSafeContext(context2)) {
            return context2.shrink().map(fromShrinkableToNextValue);
          }
          return Stream.nil();
        }
        isSafeContext(context2) {
          return context2 != null && typeof context2 === "object" && "value" in context2 && "shrink" in context2;
        }
        filter(refinement) {
          return _ConverterToNext.convertIfNeeded(this.arb.filter(refinement));
        }
        map(mapper) {
          return _ConverterToNext.convertIfNeeded(this.arb.map(mapper));
        }
        chain(fmapper) {
          return _ConverterToNext.convertIfNeeded(this.arb.chain((t2) => {
            const fmapped = fmapper(t2);
            if (_ConverterToNext.isConverterToNext(fmapped))
              return fmapped.arb;
            else
              return new ConverterFromNext(fmapped);
          }));
        }
        noShrink() {
          return _ConverterToNext.convertIfNeeded(this.arb.noShrink());
        }
        noBias() {
          return _ConverterToNext.convertIfNeeded(this.arb.noBias());
        }
      };
      _a = identifier;
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/ConverterFromNext.js
  function fromNextValueToShrinkableFor(arb) {
    return function fromNextValueToShrinkable(v) {
      const value_ = v.value_;
      const shrinker = () => arb.shrink(value_, v.context).map(fromNextValueToShrinkable);
      if (!v.hasToBeCloned) {
        return new Shrinkable(value_, shrinker);
      }
      return new Shrinkable(value_, shrinker, () => v.value);
    };
  }
  var _a2, identifier2, ConverterFromNext;
  var init_ConverterFromNext = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/definition/ConverterFromNext.js"() {
      init_ArbitraryWithContextualShrink();
      init_ConverterToNext();
      init_Shrinkable();
      identifier2 = "__ConverterFromNext__";
      ConverterFromNext = class _ConverterFromNext extends ArbitraryWithContextualShrink {
        constructor(arb, legacyShrunkOnceContext, biasFactor = void 0) {
          super();
          this.arb = arb;
          this.legacyShrunkOnceContext = legacyShrunkOnceContext;
          this.biasFactor = biasFactor;
          this[_a2] = true;
          this.toShrinkable = fromNextValueToShrinkableFor(arb);
        }
        static isConverterFromNext(arb) {
          return identifier2 in arb;
        }
        static convertIfNeeded(arb) {
          if (ConverterToNext.isConverterToNext(arb))
            return arb.arb;
          else
            return new _ConverterFromNext(arb);
        }
        generate(mrng) {
          const g = this.arb.generate(mrng, this.biasFactor);
          return this.toShrinkable(g);
        }
        contextualShrink(value, context2) {
          return this.arb.shrink(value, context2).map((v) => [v.value_, v.context]);
        }
        shrunkOnceContext() {
          return this.legacyShrunkOnceContext;
        }
        filter(refinement) {
          return _ConverterFromNext.convertIfNeeded(this.arb.filter(refinement));
        }
        map(mapper) {
          return _ConverterFromNext.convertIfNeeded(this.arb.map(mapper));
        }
        chain(fmapper) {
          return _ConverterFromNext.convertIfNeeded(this.arb.chain((t2) => {
            const fmapped = fmapper(t2);
            if (_ConverterFromNext.isConverterFromNext(fmapped))
              return fmapped.arb;
            else
              return new ConverterToNext(fmapped);
          }));
        }
        noShrink() {
          return _ConverterFromNext.convertIfNeeded(this.arb.noShrink());
        }
        withBias(freq) {
          return new _ConverterFromNext(this.arb, this.legacyShrunkOnceContext, freq);
        }
        noBias() {
          return _ConverterFromNext.convertIfNeeded(this.arb.noBias());
        }
      };
      _a2 = identifier2;
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/Converters.js
  function convertFromNext(arb) {
    if (ConverterToNext.isConverterToNext(arb)) {
      return arb.arb;
    }
    assertIsNextArbitrary(arb);
    return new ConverterFromNext(arb);
  }
  function convertFromNextWithShrunkOnce(arb, legacyShrunkOnceContext) {
    if (ConverterToNext.isConverterToNext(arb)) {
      if (!("contextualShrink" in arb.arb) || !("contextualShrinkableFor" in arb.arb) || !("shrunkOnceContext" in arb.arb) || !("shrink" in arb.arb) || !("shrinkableFor" in arb.arb)) {
        throw new Error("Conversion rejected: Underlying arbitrary is not compatible with ArbitraryWithContextualShrink");
      }
      return arb.arb;
    }
    assertIsNextArbitrary(arb);
    return new ConverterFromNext(arb, legacyShrunkOnceContext);
  }
  function convertToNext(arb) {
    if (ConverterFromNext.isConverterFromNext(arb)) {
      return arb.arb;
    }
    assertIsArbitrary(arb);
    return new ConverterToNext(arb);
  }
  var init_Converters = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/definition/Converters.js"() {
      init_Arbitrary();
      init_ConverterFromNext();
      init_ConverterToNext();
      init_NextArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/TupleArbitrary.js
  var TupleArbitrary;
  var init_TupleArbitrary = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/TupleArbitrary.js"() {
      init_Stream();
      init_symbols();
      init_NextArbitrary();
      init_NextValue();
      TupleArbitrary = class _TupleArbitrary extends NextArbitrary {
        constructor(arbs) {
          super();
          this.arbs = arbs;
          for (let idx = 0; idx !== arbs.length; ++idx) {
            const arb = arbs[idx];
            if (arb == null || arb.generate == null)
              throw new Error(`Invalid parameter encountered at index ${idx}: expecting an Arbitrary`);
          }
        }
        static makeItCloneable(vs, values) {
          return Object.defineProperty(vs, cloneMethod, {
            value: () => {
              const cloned = [];
              for (let idx = 0; idx !== values.length; ++idx) {
                cloned.push(values[idx].value);
              }
              _TupleArbitrary.makeItCloneable(cloned, values);
              return cloned;
            }
          });
        }
        static wrapper(values) {
          let cloneable = false;
          const vs = [];
          const ctxs = [];
          for (let idx = 0; idx !== values.length; ++idx) {
            const v = values[idx];
            cloneable = cloneable || v.hasToBeCloned;
            vs.push(v.value);
            ctxs.push(v.context);
          }
          if (cloneable) {
            _TupleArbitrary.makeItCloneable(vs, values);
          }
          return new NextValue(vs, ctxs);
        }
        generate(mrng, biasFactor) {
          return _TupleArbitrary.wrapper(this.arbs.map((a) => a.generate(mrng, biasFactor)));
        }
        canShrinkWithoutContext(value) {
          if (!Array.isArray(value) || value.length !== this.arbs.length) {
            return false;
          }
          for (let index = 0; index !== this.arbs.length; ++index) {
            if (!this.arbs[index].canShrinkWithoutContext(value[index])) {
              return false;
            }
          }
          return true;
        }
        shrink(value, context2) {
          let s = Stream.nil();
          const safeContext = Array.isArray(context2) ? context2 : [];
          for (let idx = 0; idx !== this.arbs.length; ++idx) {
            const shrinksForIndex = this.arbs[idx].shrink(value[idx], safeContext[idx]).map((v) => {
              const nextValues = value.map((v2, idx2) => new NextValue(cloneIfNeeded(v2), safeContext[idx2]));
              return nextValues.slice(0, idx).concat([v]).concat(nextValues.slice(idx + 1));
            }).map((values) => _TupleArbitrary.wrapper(values));
            s = s.join(shrinksForIndex);
          }
          return s;
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/genericTuple.js
  function genericTuple(arbs) {
    const nextArbs = arbs.map((arb) => convertToNext(arb));
    return convertFromNext(new TupleArbitrary(nextArbs));
  }
  var init_genericTuple = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/genericTuple.js"() {
      init_Converters();
      init_TupleArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/check/property/IRawProperty.js
  var runIdToFrequency;
  var init_IRawProperty = __esm({
    "node_modules/fast-check/lib/esm/check/property/IRawProperty.js"() {
      runIdToFrequency = (runId) => 2 + Math.floor(Math.log(runId + 1) / Math.log(10));
    }
  });

  // node_modules/fast-check/lib/esm/check/runner/configuration/GlobalParameters.js
  function readConfigureGlobal() {
    return globalParameters;
  }
  var globalParameters;
  var init_GlobalParameters = __esm({
    "node_modules/fast-check/lib/esm/check/runner/configuration/GlobalParameters.js"() {
      globalParameters = {};
    }
  });

  // node_modules/fast-check/lib/esm/check/property/AsyncProperty.generic.js
  var AsyncProperty;
  var init_AsyncProperty_generic = __esm({
    "node_modules/fast-check/lib/esm/check/property/AsyncProperty.generic.js"() {
      init_PreconditionFailure();
      init_IRawProperty();
      init_GlobalParameters();
      init_ConverterFromNext();
      AsyncProperty = class _AsyncProperty {
        constructor(arb, predicate) {
          this.arb = arb;
          this.predicate = predicate;
          this.isAsync = () => true;
          const { asyncBeforeEach, asyncAfterEach, beforeEach, afterEach } = readConfigureGlobal() || {};
          if (asyncBeforeEach !== void 0 && beforeEach !== void 0) {
            throw Error(`Global "asyncBeforeEach" and "beforeEach" parameters can't be set at the same time when running async properties`);
          }
          if (asyncAfterEach !== void 0 && afterEach !== void 0) {
            throw Error(`Global "asyncAfterEach" and "afterEach" parameters can't be set at the same time when running async properties`);
          }
          this.beforeEachHook = asyncBeforeEach || beforeEach || _AsyncProperty.dummyHook;
          this.afterEachHook = asyncAfterEach || afterEach || _AsyncProperty.dummyHook;
        }
        generate(mrng, runId) {
          if (ConverterFromNext.isConverterFromNext(this.arb)) {
            return this.arb.toShrinkable(this.arb.arb.generate(mrng, runId != null ? runIdToFrequency(runId) : void 0));
          }
          return runId != null ? this.arb.withBias(runIdToFrequency(runId)).generate(mrng) : this.arb.generate(mrng);
        }
        async run(v) {
          await this.beforeEachHook();
          try {
            const output = await this.predicate(v);
            return output == null || output === true ? null : "Property failed by returning false";
          } catch (err) {
            if (PreconditionFailure.isFailure(err))
              return err;
            if (err instanceof Error && err.stack)
              return `${err}

Stack trace: ${err.stack}`;
            return `${err}`;
          } finally {
            await this.afterEachHook();
          }
        }
        beforeEach(hookFunction) {
          const previousBeforeEachHook = this.beforeEachHook;
          this.beforeEachHook = () => hookFunction(previousBeforeEachHook);
          return this;
        }
        afterEach(hookFunction) {
          const previousAfterEachHook = this.afterEachHook;
          this.afterEachHook = () => hookFunction(previousAfterEachHook);
          return this;
        }
      };
      AsyncProperty.dummyHook = () => {
      };
    }
  });

  // node_modules/fast-check/lib/esm/check/property/AsyncProperty.generated.js
  var init_AsyncProperty_generated = __esm({
    "node_modules/fast-check/lib/esm/check/property/AsyncProperty.generated.js"() {
      init_genericTuple();
      init_AsyncProperty_generic();
    }
  });

  // node_modules/fast-check/lib/esm/check/property/AsyncProperty.js
  var init_AsyncProperty = __esm({
    "node_modules/fast-check/lib/esm/check/property/AsyncProperty.js"() {
      init_AsyncProperty_generated();
    }
  });

  // node_modules/fast-check/lib/esm/check/property/Property.generic.js
  var Property;
  var init_Property_generic = __esm({
    "node_modules/fast-check/lib/esm/check/property/Property.generic.js"() {
      init_PreconditionFailure();
      init_IRawProperty();
      init_GlobalParameters();
      init_ConverterFromNext();
      Property = class _Property {
        constructor(arb, predicate) {
          this.arb = arb;
          this.predicate = predicate;
          this.isAsync = () => false;
          const { beforeEach = _Property.dummyHook, afterEach = _Property.dummyHook, asyncBeforeEach, asyncAfterEach } = readConfigureGlobal() || {};
          if (asyncBeforeEach !== void 0) {
            throw Error(`"asyncBeforeEach" can't be set when running synchronous properties`);
          }
          if (asyncAfterEach !== void 0) {
            throw Error(`"asyncAfterEach" can't be set when running synchronous properties`);
          }
          this.beforeEachHook = beforeEach;
          this.afterEachHook = afterEach;
        }
        generate(mrng, runId) {
          if (ConverterFromNext.isConverterFromNext(this.arb)) {
            return this.arb.toShrinkable(this.arb.arb.generate(mrng, runId != null ? runIdToFrequency(runId) : void 0));
          }
          return runId != null ? this.arb.withBias(runIdToFrequency(runId)).generate(mrng) : this.arb.generate(mrng);
        }
        run(v) {
          this.beforeEachHook();
          try {
            const output = this.predicate(v);
            return output == null || output === true ? null : "Property failed by returning false";
          } catch (err) {
            if (PreconditionFailure.isFailure(err))
              return err;
            if (err instanceof Error && err.stack)
              return `${err}

Stack trace: ${err.stack}`;
            return `${err}`;
          } finally {
            this.afterEachHook();
          }
        }
        beforeEach(hookFunction) {
          const previousBeforeEachHook = this.beforeEachHook;
          this.beforeEachHook = () => hookFunction(previousBeforeEachHook);
          return this;
        }
        afterEach(hookFunction) {
          const previousAfterEachHook = this.afterEachHook;
          this.afterEachHook = () => hookFunction(previousAfterEachHook);
          return this;
        }
      };
      Property.dummyHook = () => {
      };
    }
  });

  // node_modules/fast-check/lib/esm/check/property/Property.generated.js
  function property(...args) {
    if (args.length < 2)
      throw new Error("property expects at least two parameters");
    const arbs = args.slice(0, args.length - 1);
    const p = args[args.length - 1];
    return new Property(genericTuple(arbs), (t2) => p(...t2));
  }
  var init_Property_generated = __esm({
    "node_modules/fast-check/lib/esm/check/property/Property.generated.js"() {
      init_genericTuple();
      init_Property_generic();
    }
  });

  // node_modules/fast-check/lib/esm/check/property/Property.js
  var init_Property = __esm({
    "node_modules/fast-check/lib/esm/check/property/Property.js"() {
      init_Property_generated();
    }
  });

  // node_modules/pure-rand/lib/esm/generator/RandomGenerator.js
  function unsafeGenerateN(rng, num) {
    var out = [];
    for (var idx = 0; idx != num; ++idx) {
      out.push(rng.unsafeNext());
    }
    return out;
  }
  function generateN(rng, num) {
    var nextRng = rng.clone();
    var out = unsafeGenerateN(nextRng, num);
    return [out, nextRng];
  }
  function unsafeSkipN(rng, num) {
    for (var idx = 0; idx != num; ++idx) {
      rng.unsafeNext();
    }
  }
  function skipN(rng, num) {
    var nextRng = rng.clone();
    unsafeSkipN(nextRng, num);
    return nextRng;
  }
  var init_RandomGenerator = __esm({
    "node_modules/pure-rand/lib/esm/generator/RandomGenerator.js"() {
    }
  });

  // node_modules/pure-rand/lib/esm/generator/LinearCongruential.js
  var MULTIPLIER, INCREMENT, MASK, MASK_2, computeNextSeed, computeValueFromNextSeed, LinearCongruential, LinearCongruential32, congruential, congruential32;
  var init_LinearCongruential = __esm({
    "node_modules/pure-rand/lib/esm/generator/LinearCongruential.js"() {
      MULTIPLIER = 214013;
      INCREMENT = 2531011;
      MASK = 4294967295;
      MASK_2 = (1 << 31) - 1;
      computeNextSeed = function(seed) {
        return seed * MULTIPLIER + INCREMENT & MASK;
      };
      computeValueFromNextSeed = function(nextseed) {
        return (nextseed & MASK_2) >> 16;
      };
      LinearCongruential = function() {
        function LinearCongruential2(seed) {
          this.seed = seed;
        }
        LinearCongruential2.prototype.min = function() {
          return LinearCongruential2.min;
        };
        LinearCongruential2.prototype.max = function() {
          return LinearCongruential2.max;
        };
        LinearCongruential2.prototype.clone = function() {
          return new LinearCongruential2(this.seed);
        };
        LinearCongruential2.prototype.next = function() {
          var nextRng = new LinearCongruential2(this.seed);
          var out = nextRng.unsafeNext();
          return [out, nextRng];
        };
        LinearCongruential2.prototype.unsafeNext = function() {
          this.seed = computeNextSeed(this.seed);
          return computeValueFromNextSeed(this.seed);
        };
        LinearCongruential2.min = 0;
        LinearCongruential2.max = Math.pow(2, 15) - 1;
        return LinearCongruential2;
      }();
      LinearCongruential32 = function() {
        function LinearCongruential322(seed) {
          this.seed = seed;
        }
        LinearCongruential322.prototype.min = function() {
          return LinearCongruential322.min;
        };
        LinearCongruential322.prototype.max = function() {
          return LinearCongruential322.max;
        };
        LinearCongruential322.prototype.clone = function() {
          return new LinearCongruential322(this.seed);
        };
        LinearCongruential322.prototype.next = function() {
          var nextRng = new LinearCongruential322(this.seed);
          var out = nextRng.unsafeNext();
          return [out, nextRng];
        };
        LinearCongruential322.prototype.unsafeNext = function() {
          var s1 = computeNextSeed(this.seed);
          var v1 = computeValueFromNextSeed(s1);
          var s2 = computeNextSeed(s1);
          var v2 = computeValueFromNextSeed(s2);
          this.seed = computeNextSeed(s2);
          var v3 = computeValueFromNextSeed(this.seed);
          var vnext = v3 + (v2 + (v1 << 15) << 15);
          return (vnext + 2147483648 | 0) + 2147483648;
        };
        LinearCongruential322.min = 0;
        LinearCongruential322.max = 4294967295;
        return LinearCongruential322;
      }();
      congruential = function(seed) {
        return new LinearCongruential(seed);
      };
      congruential32 = function(seed) {
        return new LinearCongruential32(seed);
      };
    }
  });

  // node_modules/pure-rand/lib/esm/generator/MersenneTwister.js
  function MersenneTwister_default(seed) {
    return MersenneTwister.from(seed);
  }
  var MersenneTwister;
  var init_MersenneTwister = __esm({
    "node_modules/pure-rand/lib/esm/generator/MersenneTwister.js"() {
      MersenneTwister = function() {
        function MersenneTwister2(states, index) {
          this.states = states;
          this.index = index;
        }
        MersenneTwister2.twist = function(prev) {
          var mt = prev.slice();
          for (var idx = 0; idx !== MersenneTwister2.N - MersenneTwister2.M; ++idx) {
            var y_1 = (mt[idx] & MersenneTwister2.MASK_UPPER) + (mt[idx + 1] & MersenneTwister2.MASK_LOWER);
            mt[idx] = mt[idx + MersenneTwister2.M] ^ y_1 >>> 1 ^ -(y_1 & 1) & MersenneTwister2.A;
          }
          for (var idx = MersenneTwister2.N - MersenneTwister2.M; idx !== MersenneTwister2.N - 1; ++idx) {
            var y_2 = (mt[idx] & MersenneTwister2.MASK_UPPER) + (mt[idx + 1] & MersenneTwister2.MASK_LOWER);
            mt[idx] = mt[idx + MersenneTwister2.M - MersenneTwister2.N] ^ y_2 >>> 1 ^ -(y_2 & 1) & MersenneTwister2.A;
          }
          var y = (mt[MersenneTwister2.N - 1] & MersenneTwister2.MASK_UPPER) + (mt[0] & MersenneTwister2.MASK_LOWER);
          mt[MersenneTwister2.N - 1] = mt[MersenneTwister2.M - 1] ^ y >>> 1 ^ -(y & 1) & MersenneTwister2.A;
          return mt;
        };
        MersenneTwister2.seeded = function(seed) {
          var out = Array(MersenneTwister2.N);
          out[0] = seed;
          for (var idx = 1; idx !== MersenneTwister2.N; ++idx) {
            var xored = out[idx - 1] ^ out[idx - 1] >>> 30;
            out[idx] = Math.imul(MersenneTwister2.F, xored) + idx | 0;
          }
          return out;
        };
        MersenneTwister2.from = function(seed) {
          return new MersenneTwister2(MersenneTwister2.twist(MersenneTwister2.seeded(seed)), 0);
        };
        MersenneTwister2.prototype.min = function() {
          return MersenneTwister2.min;
        };
        MersenneTwister2.prototype.max = function() {
          return MersenneTwister2.max;
        };
        MersenneTwister2.prototype.clone = function() {
          return new MersenneTwister2(this.states, this.index);
        };
        MersenneTwister2.prototype.next = function() {
          var nextRng = new MersenneTwister2(this.states, this.index);
          var out = nextRng.unsafeNext();
          return [out, nextRng];
        };
        MersenneTwister2.prototype.unsafeNext = function() {
          var y = this.states[this.index];
          y ^= this.states[this.index] >>> MersenneTwister2.U;
          y ^= y << MersenneTwister2.S & MersenneTwister2.B;
          y ^= y << MersenneTwister2.T & MersenneTwister2.C;
          y ^= y >>> MersenneTwister2.L;
          if (++this.index >= MersenneTwister2.N) {
            this.states = MersenneTwister2.twist(this.states);
            this.index = 0;
          }
          return y >>> 0;
        };
        MersenneTwister2.min = 0;
        MersenneTwister2.max = 4294967295;
        MersenneTwister2.N = 624;
        MersenneTwister2.M = 397;
        MersenneTwister2.R = 31;
        MersenneTwister2.A = 2567483615;
        MersenneTwister2.F = 1812433253;
        MersenneTwister2.U = 11;
        MersenneTwister2.S = 7;
        MersenneTwister2.B = 2636928640;
        MersenneTwister2.T = 15;
        MersenneTwister2.C = 4022730752;
        MersenneTwister2.L = 18;
        MersenneTwister2.MASK_LOWER = Math.pow(2, MersenneTwister2.R) - 1;
        MersenneTwister2.MASK_UPPER = Math.pow(2, MersenneTwister2.R);
        return MersenneTwister2;
      }();
    }
  });

  // node_modules/pure-rand/lib/esm/generator/XorShift.js
  var XorShift128Plus, xorshift128plus;
  var init_XorShift = __esm({
    "node_modules/pure-rand/lib/esm/generator/XorShift.js"() {
      XorShift128Plus = function() {
        function XorShift128Plus2(s01, s00, s11, s10) {
          this.s01 = s01;
          this.s00 = s00;
          this.s11 = s11;
          this.s10 = s10;
        }
        XorShift128Plus2.prototype.min = function() {
          return -2147483648;
        };
        XorShift128Plus2.prototype.max = function() {
          return 2147483647;
        };
        XorShift128Plus2.prototype.clone = function() {
          return new XorShift128Plus2(this.s01, this.s00, this.s11, this.s10);
        };
        XorShift128Plus2.prototype.next = function() {
          var nextRng = new XorShift128Plus2(this.s01, this.s00, this.s11, this.s10);
          var out = nextRng.unsafeNext();
          return [out, nextRng];
        };
        XorShift128Plus2.prototype.unsafeNext = function() {
          var a0 = this.s00 ^ this.s00 << 23;
          var a1 = this.s01 ^ (this.s01 << 23 | this.s00 >>> 9);
          var b0 = a0 ^ this.s10 ^ (a0 >>> 18 | a1 << 14) ^ (this.s10 >>> 5 | this.s11 << 27);
          var b1 = a1 ^ this.s11 ^ a1 >>> 18 ^ this.s11 >>> 5;
          var out = this.s00 + this.s10 | 0;
          this.s01 = this.s11;
          this.s00 = this.s10;
          this.s11 = b1;
          this.s10 = b0;
          return out;
        };
        XorShift128Plus2.prototype.jump = function() {
          var nextRng = new XorShift128Plus2(this.s01, this.s00, this.s11, this.s10);
          nextRng.unsafeJump();
          return nextRng;
        };
        XorShift128Plus2.prototype.unsafeJump = function() {
          var ns01 = 0;
          var ns00 = 0;
          var ns11 = 0;
          var ns10 = 0;
          var jump = [1667051007, 2321340297, 1548169110, 304075285];
          for (var i2 = 0; i2 !== 4; ++i2) {
            for (var mask = 1; mask; mask <<= 1) {
              if (jump[i2] & mask) {
                ns01 ^= this.s01;
                ns00 ^= this.s00;
                ns11 ^= this.s11;
                ns10 ^= this.s10;
              }
              this.unsafeNext();
            }
          }
          this.s01 = ns01;
          this.s00 = ns00;
          this.s11 = ns11;
          this.s10 = ns10;
        };
        return XorShift128Plus2;
      }();
      xorshift128plus = function(seed) {
        return new XorShift128Plus(-1, ~seed, seed | 0, 0);
      };
    }
  });

  // node_modules/pure-rand/lib/esm/generator/XoroShiro.js
  var XoroShiro128Plus, xoroshiro128plus;
  var init_XoroShiro = __esm({
    "node_modules/pure-rand/lib/esm/generator/XoroShiro.js"() {
      XoroShiro128Plus = function() {
        function XoroShiro128Plus2(s01, s00, s11, s10) {
          this.s01 = s01;
          this.s00 = s00;
          this.s11 = s11;
          this.s10 = s10;
        }
        XoroShiro128Plus2.prototype.min = function() {
          return -2147483648;
        };
        XoroShiro128Plus2.prototype.max = function() {
          return 2147483647;
        };
        XoroShiro128Plus2.prototype.clone = function() {
          return new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
        };
        XoroShiro128Plus2.prototype.next = function() {
          var nextRng = new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
          var out = nextRng.unsafeNext();
          return [out, nextRng];
        };
        XoroShiro128Plus2.prototype.unsafeNext = function() {
          var out = this.s00 + this.s10 | 0;
          var a0 = this.s10 ^ this.s00;
          var a1 = this.s11 ^ this.s01;
          var s00 = this.s00;
          var s01 = this.s01;
          this.s00 = s00 << 24 ^ s01 >>> 8 ^ a0 ^ a0 << 16;
          this.s01 = s01 << 24 ^ s00 >>> 8 ^ a1 ^ (a1 << 16 | a0 >>> 16);
          this.s10 = a1 << 5 ^ a0 >>> 27;
          this.s11 = a0 << 5 ^ a1 >>> 27;
          return out;
        };
        XoroShiro128Plus2.prototype.jump = function() {
          var nextRng = new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
          nextRng.unsafeJump();
          return nextRng;
        };
        XoroShiro128Plus2.prototype.unsafeJump = function() {
          var ns01 = 0;
          var ns00 = 0;
          var ns11 = 0;
          var ns10 = 0;
          var jump = [3639956645, 3750757012, 1261568508, 386426335];
          for (var i2 = 0; i2 !== 4; ++i2) {
            for (var mask = 1; mask; mask <<= 1) {
              if (jump[i2] & mask) {
                ns01 ^= this.s01;
                ns00 ^= this.s00;
                ns11 ^= this.s11;
                ns10 ^= this.s10;
              }
              this.unsafeNext();
            }
          }
          this.s01 = ns01;
          this.s00 = ns00;
          this.s11 = ns11;
          this.s10 = ns10;
        };
        return XoroShiro128Plus2;
      }();
      xoroshiro128plus = function(seed) {
        return new XoroShiro128Plus(-1, ~seed, seed | 0, 0);
      };
    }
  });

  // node_modules/pure-rand/lib/esm/distribution/internals/ArrayInt.js
  function addArrayIntToNew(arrayIntA, arrayIntB) {
    if (arrayIntA.sign !== arrayIntB.sign) {
      return substractArrayIntToNew(arrayIntA, { sign: -arrayIntB.sign, data: arrayIntB.data });
    }
    var data = [];
    var reminder = 0;
    var dataA = arrayIntA.data;
    var dataB = arrayIntB.data;
    for (var indexA = dataA.length - 1, indexB = dataB.length - 1; indexA >= 0 || indexB >= 0; --indexA, --indexB) {
      var vA = indexA >= 0 ? dataA[indexA] : 0;
      var vB = indexB >= 0 ? dataB[indexB] : 0;
      var current = vA + vB + reminder;
      data.push(current >>> 0);
      reminder = ~~(current / 4294967296);
    }
    if (reminder !== 0) {
      data.push(reminder);
    }
    return { sign: arrayIntA.sign, data: data.reverse() };
  }
  function addOneToPositiveArrayInt(arrayInt) {
    arrayInt.sign = 1;
    var data = arrayInt.data;
    for (var index = data.length - 1; index >= 0; --index) {
      if (data[index] === 4294967295) {
        data[index] = 0;
      } else {
        data[index] += 1;
        return arrayInt;
      }
    }
    data.unshift(1);
    return arrayInt;
  }
  function isStrictlySmaller(dataA, dataB) {
    var maxLength = Math.max(dataA.length, dataB.length);
    for (var index = 0; index < maxLength; ++index) {
      var indexA = index + dataA.length - maxLength;
      var indexB = index + dataB.length - maxLength;
      var vA = indexA >= 0 ? dataA[indexA] : 0;
      var vB = indexB >= 0 ? dataB[indexB] : 0;
      if (vA < vB)
        return true;
      if (vA > vB)
        return false;
    }
    return false;
  }
  function substractArrayIntToNew(arrayIntA, arrayIntB) {
    if (arrayIntA.sign !== arrayIntB.sign) {
      return addArrayIntToNew(arrayIntA, { sign: -arrayIntB.sign, data: arrayIntB.data });
    }
    var dataA = arrayIntA.data;
    var dataB = arrayIntB.data;
    if (isStrictlySmaller(dataA, dataB)) {
      var out = substractArrayIntToNew(arrayIntB, arrayIntA);
      out.sign = -out.sign;
      return out;
    }
    var data = [];
    var reminder = 0;
    for (var indexA = dataA.length - 1, indexB = dataB.length - 1; indexA >= 0 || indexB >= 0; --indexA, --indexB) {
      var vA = indexA >= 0 ? dataA[indexA] : 0;
      var vB = indexB >= 0 ? dataB[indexB] : 0;
      var current = vA - vB - reminder;
      data.push(current >>> 0);
      reminder = current < 0 ? 1 : 0;
    }
    return { sign: arrayIntA.sign, data: data.reverse() };
  }
  function trimArrayIntInplace(arrayInt) {
    var data = arrayInt.data;
    var firstNonZero = 0;
    for (; firstNonZero !== data.length && data[firstNonZero] === 0; ++firstNonZero) {
    }
    if (firstNonZero === data.length) {
      arrayInt.sign = 1;
      arrayInt.data = [0];
      return arrayInt;
    }
    data.splice(0, firstNonZero);
    return arrayInt;
  }
  function fromNumberToArrayInt64(out, n) {
    if (n < 0) {
      var posN = -n;
      out.sign = -1;
      out.data[0] = ~~(posN / 4294967296);
      out.data[1] = posN >>> 0;
    } else {
      out.sign = 1;
      out.data[0] = ~~(n / 4294967296);
      out.data[1] = n >>> 0;
    }
    return out;
  }
  function substractArrayInt64(out, arrayIntA, arrayIntB) {
    var lowA = arrayIntA.data[1];
    var highA = arrayIntA.data[0];
    var signA = arrayIntA.sign;
    var lowB = arrayIntB.data[1];
    var highB = arrayIntB.data[0];
    var signB = arrayIntB.sign;
    out.sign = 1;
    if (signA === 1 && signB === -1) {
      var low_1 = lowA + lowB;
      var high = highA + highB + (low_1 > 4294967295 ? 1 : 0);
      out.data[0] = high >>> 0;
      out.data[1] = low_1 >>> 0;
      return out;
    }
    var lowFirst = lowA;
    var highFirst = highA;
    var lowSecond = lowB;
    var highSecond = highB;
    if (signA === -1) {
      lowFirst = lowB;
      highFirst = highB;
      lowSecond = lowA;
      highSecond = highA;
    }
    var reminderLow = 0;
    var low = lowFirst - lowSecond;
    if (low < 0) {
      reminderLow = 1;
      low = low >>> 0;
    }
    out.data[0] = highFirst - highSecond - reminderLow;
    out.data[1] = low;
    return out;
  }
  var init_ArrayInt = __esm({
    "node_modules/pure-rand/lib/esm/distribution/internals/ArrayInt.js"() {
    }
  });

  // node_modules/pure-rand/lib/esm/distribution/internals/UnsafeUniformIntDistributionInternal.js
  function unsafeUniformIntDistributionInternal(rangeSize, rng) {
    var MinRng = rng.min();
    var NumValues = rng.max() - rng.min() + 1;
    if (rangeSize <= NumValues) {
      var nrng_1 = rng;
      var MaxAllowed = NumValues - NumValues % rangeSize;
      while (true) {
        var out = nrng_1.unsafeNext();
        var deltaV = out - MinRng;
        if (deltaV < MaxAllowed) {
          return deltaV % rangeSize;
        }
      }
    }
    var FinalNumValues = NumValues * NumValues;
    var NumIterations = 2;
    while (FinalNumValues < rangeSize) {
      FinalNumValues *= NumValues;
      ++NumIterations;
    }
    var MaxAcceptedRandom = rangeSize * Math.floor(1 * FinalNumValues / rangeSize);
    var nrng = rng;
    while (true) {
      var value = 0;
      for (var num = 0; num !== NumIterations; ++num) {
        var out = nrng.unsafeNext();
        value = NumValues * value + (out - MinRng);
      }
      if (value < MaxAcceptedRandom) {
        var inDiff = value - rangeSize * Math.floor(1 * value / rangeSize);
        return inDiff;
      }
    }
  }
  var init_UnsafeUniformIntDistributionInternal = __esm({
    "node_modules/pure-rand/lib/esm/distribution/internals/UnsafeUniformIntDistributionInternal.js"() {
    }
  });

  // node_modules/pure-rand/lib/esm/distribution/internals/UnsafeUniformArrayIntDistributionInternal.js
  function unsafeUniformArrayIntDistributionInternal(out, rangeSize, rng) {
    var rangeLength = rangeSize.length;
    while (true) {
      for (var index = 0; index !== rangeLength; ++index) {
        var indexRangeSize = index === 0 ? rangeSize[0] + 1 : 4294967296;
        var g = unsafeUniformIntDistributionInternal(indexRangeSize, rng);
        out[index] = g;
      }
      for (var index = 0; index !== rangeLength; ++index) {
        var current = out[index];
        var currentInRange = rangeSize[index];
        if (current < currentInRange) {
          return out;
        } else if (current > currentInRange) {
          break;
        }
      }
    }
  }
  var init_UnsafeUniformArrayIntDistributionInternal = __esm({
    "node_modules/pure-rand/lib/esm/distribution/internals/UnsafeUniformArrayIntDistributionInternal.js"() {
      init_UnsafeUniformIntDistributionInternal();
    }
  });

  // node_modules/pure-rand/lib/esm/distribution/UnsafeUniformArrayIntDistribution.js
  function unsafeUniformArrayIntDistribution(from, to, rng) {
    var rangeSize = trimArrayIntInplace(addOneToPositiveArrayInt(substractArrayIntToNew(to, from)));
    var emptyArrayIntData = rangeSize.data.slice(0);
    var g = unsafeUniformArrayIntDistributionInternal(emptyArrayIntData, rangeSize.data, rng);
    return trimArrayIntInplace(addArrayIntToNew({ sign: 1, data: g }, from));
  }
  var init_UnsafeUniformArrayIntDistribution = __esm({
    "node_modules/pure-rand/lib/esm/distribution/UnsafeUniformArrayIntDistribution.js"() {
      init_ArrayInt();
      init_UnsafeUniformArrayIntDistributionInternal();
    }
  });

  // node_modules/pure-rand/lib/esm/distribution/UniformArrayIntDistribution.js
  function uniformArrayIntDistribution(from, to, rng) {
    if (rng != null) {
      var nextRng = rng.clone();
      return [unsafeUniformArrayIntDistribution(from, to, nextRng), nextRng];
    }
    return function(rng2) {
      var nextRng2 = rng2.clone();
      return [unsafeUniformArrayIntDistribution(from, to, nextRng2), nextRng2];
    };
  }
  var init_UniformArrayIntDistribution = __esm({
    "node_modules/pure-rand/lib/esm/distribution/UniformArrayIntDistribution.js"() {
      init_UnsafeUniformArrayIntDistribution();
    }
  });

  // node_modules/pure-rand/lib/esm/distribution/UnsafeUniformBigIntDistribution.js
  function unsafeUniformBigIntDistribution(from, to, rng) {
    var diff = to - from + BigInt(1);
    var MinRng = BigInt(rng.min());
    var NumValues = BigInt(rng.max() - rng.min() + 1);
    var FinalNumValues = NumValues;
    var NumIterations = BigInt(1);
    while (FinalNumValues < diff) {
      FinalNumValues *= NumValues;
      ++NumIterations;
    }
    var MaxAcceptedRandom = FinalNumValues - FinalNumValues % diff;
    while (true) {
      var value = BigInt(0);
      for (var num = BigInt(0); num !== NumIterations; ++num) {
        var out = rng.unsafeNext();
        value = NumValues * value + (BigInt(out) - MinRng);
      }
      if (value < MaxAcceptedRandom) {
        var inDiff = value % diff;
        return inDiff + from;
      }
    }
  }
  var init_UnsafeUniformBigIntDistribution = __esm({
    "node_modules/pure-rand/lib/esm/distribution/UnsafeUniformBigIntDistribution.js"() {
    }
  });

  // node_modules/pure-rand/lib/esm/distribution/UniformBigIntDistribution.js
  function uniformBigIntDistribution(from, to, rng) {
    if (rng != null) {
      var nextRng = rng.clone();
      return [unsafeUniformBigIntDistribution(from, to, nextRng), nextRng];
    }
    return function(rng2) {
      var nextRng2 = rng2.clone();
      return [unsafeUniformBigIntDistribution(from, to, nextRng2), nextRng2];
    };
  }
  var init_UniformBigIntDistribution = __esm({
    "node_modules/pure-rand/lib/esm/distribution/UniformBigIntDistribution.js"() {
      init_UnsafeUniformBigIntDistribution();
    }
  });

  // node_modules/pure-rand/lib/esm/distribution/UnsafeUniformIntDistribution.js
  function uniformLargeIntInternal(from, to, rangeSize, rng) {
    var rangeSizeArrayIntValue = rangeSize <= Number.MAX_SAFE_INTEGER ? fromNumberToArrayInt64(sharedC, rangeSize) : substractArrayInt64(sharedC, fromNumberToArrayInt64(sharedA, to), fromNumberToArrayInt64(sharedB, from));
    if (rangeSizeArrayIntValue.data[1] === 4294967295) {
      rangeSizeArrayIntValue.data[0] += 1;
      rangeSizeArrayIntValue.data[1] = 0;
    } else {
      rangeSizeArrayIntValue.data[1] += 1;
    }
    unsafeUniformArrayIntDistributionInternal(sharedData, rangeSizeArrayIntValue.data, rng);
    return sharedData[0] * 4294967296 + sharedData[1] + from;
  }
  function unsafeUniformIntDistribution(from, to, rng) {
    var rangeSize = to - from;
    if (rangeSize <= 4294967295) {
      var g = unsafeUniformIntDistributionInternal(rangeSize + 1, rng);
      return g + from;
    }
    return uniformLargeIntInternal(from, to, rangeSize, rng);
  }
  var sharedA, sharedB, sharedC, sharedData;
  var init_UnsafeUniformIntDistribution = __esm({
    "node_modules/pure-rand/lib/esm/distribution/UnsafeUniformIntDistribution.js"() {
      init_UnsafeUniformIntDistributionInternal();
      init_ArrayInt();
      init_UnsafeUniformArrayIntDistributionInternal();
      sharedA = { sign: 1, data: [0, 0] };
      sharedB = { sign: 1, data: [0, 0] };
      sharedC = { sign: 1, data: [0, 0] };
      sharedData = [0, 0];
    }
  });

  // node_modules/pure-rand/lib/esm/distribution/UniformIntDistribution.js
  function uniformIntDistribution(from, to, rng) {
    if (rng != null) {
      var nextRng = rng.clone();
      return [unsafeUniformIntDistribution(from, to, nextRng), nextRng];
    }
    return function(rng2) {
      var nextRng2 = rng2.clone();
      return [unsafeUniformIntDistribution(from, to, nextRng2), nextRng2];
    };
  }
  var init_UniformIntDistribution = __esm({
    "node_modules/pure-rand/lib/esm/distribution/UniformIntDistribution.js"() {
      init_UnsafeUniformIntDistribution();
    }
  });

  // node_modules/pure-rand/lib/esm/pure-rand-default.js
  var pure_rand_default_exports = {};
  __export(pure_rand_default_exports, {
    __commitHash: () => __commitHash,
    __type: () => __type,
    __version: () => __version,
    congruential: () => congruential,
    congruential32: () => congruential32,
    generateN: () => generateN,
    mersenne: () => MersenneTwister_default,
    skipN: () => skipN,
    uniformArrayIntDistribution: () => uniformArrayIntDistribution,
    uniformBigIntDistribution: () => uniformBigIntDistribution,
    uniformIntDistribution: () => uniformIntDistribution,
    unsafeGenerateN: () => unsafeGenerateN,
    unsafeSkipN: () => unsafeSkipN,
    unsafeUniformArrayIntDistribution: () => unsafeUniformArrayIntDistribution,
    unsafeUniformBigIntDistribution: () => unsafeUniformBigIntDistribution,
    unsafeUniformIntDistribution: () => unsafeUniformIntDistribution,
    xoroshiro128plus: () => xoroshiro128plus,
    xorshift128plus: () => xorshift128plus
  });
  var __type, __version, __commitHash;
  var init_pure_rand_default = __esm({
    "node_modules/pure-rand/lib/esm/pure-rand-default.js"() {
      init_RandomGenerator();
      init_LinearCongruential();
      init_MersenneTwister();
      init_XorShift();
      init_XoroShiro();
      init_UniformArrayIntDistribution();
      init_UniformBigIntDistribution();
      init_UniformIntDistribution();
      init_UnsafeUniformArrayIntDistribution();
      init_UnsafeUniformBigIntDistribution();
      init_UnsafeUniformIntDistribution();
      __type = "module";
      __version = "5.0.0";
      __commitHash = "744555855a01e1551ab1cf67a6ea973d14964661";
    }
  });

  // node_modules/pure-rand/lib/esm/pure-rand.js
  var pure_rand_default;
  var init_pure_rand = __esm({
    "node_modules/pure-rand/lib/esm/pure-rand.js"() {
      init_pure_rand_default();
      init_pure_rand_default();
      pure_rand_default = pure_rand_default_exports;
    }
  });

  // node_modules/fast-check/lib/esm/check/runner/configuration/VerbosityLevel.js
  var VerbosityLevel;
  var init_VerbosityLevel = __esm({
    "node_modules/fast-check/lib/esm/check/runner/configuration/VerbosityLevel.js"() {
      (function(VerbosityLevel2) {
        VerbosityLevel2[VerbosityLevel2["None"] = 0] = "None";
        VerbosityLevel2[VerbosityLevel2["Verbose"] = 1] = "Verbose";
        VerbosityLevel2[VerbosityLevel2["VeryVerbose"] = 2] = "VeryVerbose";
      })(VerbosityLevel || (VerbosityLevel = {}));
    }
  });

  // node_modules/fast-check/lib/esm/check/runner/configuration/QualifiedParameters.js
  var QualifiedParameters;
  var init_QualifiedParameters = __esm({
    "node_modules/fast-check/lib/esm/check/runner/configuration/QualifiedParameters.js"() {
      init_pure_rand();
      init_VerbosityLevel();
      QualifiedParameters = class _QualifiedParameters {
        constructor(op) {
          const p = op || {};
          this.seed = _QualifiedParameters.readSeed(p);
          this.randomType = _QualifiedParameters.readRandomType(p);
          this.numRuns = _QualifiedParameters.readNumRuns(p);
          this.verbose = _QualifiedParameters.readVerbose(p);
          this.maxSkipsPerRun = _QualifiedParameters.readOrDefault(p, "maxSkipsPerRun", 100);
          this.timeout = _QualifiedParameters.readOrDefault(p, "timeout", null);
          this.skipAllAfterTimeLimit = _QualifiedParameters.readOrDefault(p, "skipAllAfterTimeLimit", null);
          this.interruptAfterTimeLimit = _QualifiedParameters.readOrDefault(p, "interruptAfterTimeLimit", null);
          this.markInterruptAsFailure = _QualifiedParameters.readBoolean(p, "markInterruptAsFailure");
          this.skipEqualValues = _QualifiedParameters.readBoolean(p, "skipEqualValues");
          this.ignoreEqualValues = _QualifiedParameters.readBoolean(p, "ignoreEqualValues");
          this.logger = _QualifiedParameters.readOrDefault(p, "logger", (v) => {
            console.log(v);
          });
          this.path = _QualifiedParameters.readOrDefault(p, "path", "");
          this.unbiased = _QualifiedParameters.readBoolean(p, "unbiased");
          this.examples = _QualifiedParameters.readOrDefault(p, "examples", []);
          this.endOnFailure = _QualifiedParameters.readBoolean(p, "endOnFailure");
          this.reporter = _QualifiedParameters.readOrDefault(p, "reporter", null);
          this.asyncReporter = _QualifiedParameters.readOrDefault(p, "asyncReporter", null);
        }
        toParameters() {
          const orUndefined = (value) => value !== null ? value : void 0;
          return {
            seed: this.seed,
            randomType: this.randomType,
            numRuns: this.numRuns,
            maxSkipsPerRun: this.maxSkipsPerRun,
            timeout: orUndefined(this.timeout),
            skipAllAfterTimeLimit: orUndefined(this.skipAllAfterTimeLimit),
            interruptAfterTimeLimit: orUndefined(this.interruptAfterTimeLimit),
            markInterruptAsFailure: this.markInterruptAsFailure,
            skipEqualValues: this.skipEqualValues,
            ignoreEqualValues: this.ignoreEqualValues,
            path: this.path,
            logger: this.logger,
            unbiased: this.unbiased,
            verbose: this.verbose,
            examples: this.examples,
            endOnFailure: this.endOnFailure,
            reporter: orUndefined(this.reporter),
            asyncReporter: orUndefined(this.asyncReporter)
          };
        }
        static read(op) {
          return new _QualifiedParameters(op);
        }
      };
      QualifiedParameters.readSeed = (p) => {
        if (p.seed == null)
          return Date.now() ^ Math.random() * 4294967296;
        const seed32 = p.seed | 0;
        if (p.seed === seed32)
          return seed32;
        const gap = p.seed - seed32;
        return seed32 ^ gap * 4294967296;
      };
      QualifiedParameters.readRandomType = (p) => {
        if (p.randomType == null)
          return pure_rand_default.xorshift128plus;
        if (typeof p.randomType === "string") {
          switch (p.randomType) {
            case "mersenne":
              return pure_rand_default.mersenne;
            case "congruential":
              return pure_rand_default.congruential;
            case "congruential32":
              return pure_rand_default.congruential32;
            case "xorshift128plus":
              return pure_rand_default.xorshift128plus;
            case "xoroshiro128plus":
              return pure_rand_default.xoroshiro128plus;
            default:
              throw new Error(`Invalid random specified: '${p.randomType}'`);
          }
        }
        return p.randomType;
      };
      QualifiedParameters.readNumRuns = (p) => {
        const defaultValue = 100;
        if (p.numRuns != null)
          return p.numRuns;
        if (p.num_runs != null)
          return p.num_runs;
        return defaultValue;
      };
      QualifiedParameters.readVerbose = (p) => {
        if (p.verbose == null)
          return VerbosityLevel.None;
        if (typeof p.verbose === "boolean") {
          return p.verbose === true ? VerbosityLevel.Verbose : VerbosityLevel.None;
        }
        if (p.verbose <= VerbosityLevel.None) {
          return VerbosityLevel.None;
        }
        if (p.verbose >= VerbosityLevel.VeryVerbose) {
          return VerbosityLevel.VeryVerbose;
        }
        return p.verbose | 0;
      };
      QualifiedParameters.readBoolean = (p, key) => p[key] === true;
      QualifiedParameters.readOrDefault = (p, key, defaultValue) => {
        const value = p[key];
        return value != null ? value : defaultValue;
      };
    }
  });

  // node_modules/fast-check/lib/esm/check/property/SkipAfterProperty.js
  var SkipAfterProperty;
  var init_SkipAfterProperty = __esm({
    "node_modules/fast-check/lib/esm/check/property/SkipAfterProperty.js"() {
      init_PreconditionFailure();
      SkipAfterProperty = class {
        constructor(property2, getTime, timeLimit, interruptExecution) {
          this.property = property2;
          this.getTime = getTime;
          this.interruptExecution = interruptExecution;
          this.isAsync = () => this.property.isAsync();
          this.generate = (mrng, runId) => this.property.generate(mrng, runId);
          this.run = (v) => {
            if (this.getTime() >= this.skipAfterTime) {
              const preconditionFailure = new PreconditionFailure(this.interruptExecution);
              if (this.isAsync()) {
                return Promise.resolve(preconditionFailure);
              } else {
                return preconditionFailure;
              }
            }
            return this.property.run(v);
          };
          this.skipAfterTime = this.getTime() + timeLimit;
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/check/property/TimeoutProperty.js
  var timeoutAfter, TimeoutProperty;
  var init_TimeoutProperty = __esm({
    "node_modules/fast-check/lib/esm/check/property/TimeoutProperty.js"() {
      timeoutAfter = (timeMs) => {
        let timeoutHandle = null;
        const promise = new Promise((resolve) => {
          timeoutHandle = setTimeout(() => {
            resolve(`Property timeout: exceeded limit of ${timeMs} milliseconds`);
          }, timeMs);
        });
        return {
          clear: () => clearTimeout(timeoutHandle),
          promise
        };
      };
      TimeoutProperty = class {
        constructor(property2, timeMs) {
          this.property = property2;
          this.timeMs = timeMs;
          this.isAsync = () => true;
        }
        generate(mrng, runId) {
          return this.property.generate(mrng, runId);
        }
        async run(v) {
          const t2 = timeoutAfter(this.timeMs);
          const propRun = Promise.race([this.property.run(v), t2.promise]);
          propRun.then(t2.clear, t2.clear);
          return propRun;
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/check/property/UnbiasedProperty.js
  var UnbiasedProperty;
  var init_UnbiasedProperty = __esm({
    "node_modules/fast-check/lib/esm/check/property/UnbiasedProperty.js"() {
      UnbiasedProperty = class {
        constructor(property2) {
          this.property = property2;
          this.isAsync = () => this.property.isAsync();
          this.generate = (mrng, _runId) => this.property.generate(mrng);
          this.run = (v) => this.property.run(v);
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/utils/stringify.js
  function hasToStringMethod(instance) {
    return instance !== null && (typeof instance === "object" || typeof instance === "function") && toStringMethod in instance && typeof instance[toStringMethod] === "function";
  }
  function hasAsyncToStringMethod(instance) {
    return instance !== null && (typeof instance === "object" || typeof instance === "function") && asyncToStringMethod in instance && typeof instance[asyncToStringMethod] === "function";
  }
  function getSymbolDescription(s) {
    if (s.description !== void 0)
      return s.description;
    const m = findSymbolNameRegex.exec(String(s));
    return m && m[1].length ? m[1] : null;
  }
  function stringifyNumber(numValue) {
    switch (numValue) {
      case 0:
        return 1 / numValue === Number.NEGATIVE_INFINITY ? "-0" : "0";
      case Number.NEGATIVE_INFINITY:
        return "Number.NEGATIVE_INFINITY";
      case Number.POSITIVE_INFINITY:
        return "Number.POSITIVE_INFINITY";
      default:
        return numValue === numValue ? String(numValue) : "Number.NaN";
    }
  }
  function isSparseArray(arr) {
    let previousNumberedIndex = -1;
    for (const index in arr) {
      const numberedIndex = Number(index);
      if (numberedIndex !== previousNumberedIndex + 1)
        return true;
      previousNumberedIndex = numberedIndex;
    }
    return previousNumberedIndex + 1 !== arr.length;
  }
  function stringifyInternal(value, previousValues, getAsyncContent) {
    const currentValues = previousValues.concat([value]);
    if (typeof value === "object") {
      if (previousValues.indexOf(value) !== -1) {
        return "[cyclic]";
      }
    }
    if (hasAsyncToStringMethod(value)) {
      const content = getAsyncContent(value);
      if (content.state === "fulfilled") {
        return content.value;
      }
    }
    if (hasToStringMethod(value)) {
      try {
        return value[toStringMethod]();
      } catch (err) {
      }
    }
    switch (Object.prototype.toString.call(value)) {
      case "[object Array]": {
        const arr = value;
        if (arr.length >= 50 && isSparseArray(arr)) {
          const assignments = [];
          for (const index in arr) {
            if (!Number.isNaN(Number(index)))
              assignments.push(`${index}:${stringifyInternal(arr[index], currentValues, getAsyncContent)}`);
          }
          return assignments.length !== 0 ? `Object.assign(Array(${arr.length}),{${assignments.join(",")}})` : `Array(${arr.length})`;
        }
        const stringifiedArray = arr.map((v) => stringifyInternal(v, currentValues, getAsyncContent)).join(",");
        return arr.length === 0 || arr.length - 1 in arr ? `[${stringifiedArray}]` : `[${stringifiedArray},]`;
      }
      case "[object BigInt]":
        return `${value}n`;
      case "[object Boolean]":
        return typeof value === "boolean" ? JSON.stringify(value) : `new Boolean(${JSON.stringify(value)})`;
      case "[object Date]": {
        const d = value;
        return Number.isNaN(d.getTime()) ? `new Date(NaN)` : `new Date(${JSON.stringify(d.toISOString())})`;
      }
      case "[object Map]":
        return `new Map(${stringifyInternal(Array.from(value), currentValues, getAsyncContent)})`;
      case "[object Null]":
        return `null`;
      case "[object Number]":
        return typeof value === "number" ? stringifyNumber(value) : `new Number(${stringifyNumber(Number(value))})`;
      case "[object Object]": {
        try {
          const toStringAccessor = value.toString;
          if (typeof toStringAccessor === "function" && toStringAccessor !== Object.prototype.toString) {
            return value.toString();
          }
        } catch (err) {
          return "[object Object]";
        }
        const mapper = (k) => `${k === "__proto__" ? '["__proto__"]' : typeof k === "symbol" ? `[${stringifyInternal(k, currentValues, getAsyncContent)}]` : JSON.stringify(k)}:${stringifyInternal(value[k], currentValues, getAsyncContent)}`;
        const stringifiedProperties = [
          ...Object.keys(value).map(mapper),
          ...Object.getOwnPropertySymbols(value).filter((s) => {
            const descriptor = Object.getOwnPropertyDescriptor(value, s);
            return descriptor && descriptor.enumerable;
          }).map(mapper)
        ];
        const rawRepr = "{" + stringifiedProperties.join(",") + "}";
        if (Object.getPrototypeOf(value) === null) {
          return rawRepr === "{}" ? "Object.create(null)" : `Object.assign(Object.create(null),${rawRepr})`;
        }
        return rawRepr;
      }
      case "[object Set]":
        return `new Set(${stringifyInternal(Array.from(value), currentValues, getAsyncContent)})`;
      case "[object String]":
        return typeof value === "string" ? JSON.stringify(value) : `new String(${JSON.stringify(value)})`;
      case "[object Symbol]": {
        const s = value;
        if (Symbol.keyFor(s) !== void 0) {
          return `Symbol.for(${JSON.stringify(Symbol.keyFor(s))})`;
        }
        const desc = getSymbolDescription(s);
        if (desc === null) {
          return "Symbol()";
        }
        const knownSymbol = desc.startsWith("Symbol.") && Symbol[desc.substring(7)];
        return s === knownSymbol ? desc : `Symbol(${JSON.stringify(desc)})`;
      }
      case "[object Promise]": {
        const promiseContent = getAsyncContent(value);
        switch (promiseContent.state) {
          case "fulfilled":
            return `Promise.resolve(${stringifyInternal(promiseContent.value, currentValues, getAsyncContent)})`;
          case "rejected":
            return `Promise.reject(${stringifyInternal(promiseContent.value, currentValues, getAsyncContent)})`;
          case "pending":
            return `new Promise(() => {/*pending*/})`;
          case "unknown":
          default:
            return `new Promise(() => {/*unknown*/})`;
        }
      }
      case "[object Error]":
        if (value instanceof Error) {
          return `new Error(${stringifyInternal(value.message, currentValues, getAsyncContent)})`;
        }
        break;
      case "[object Undefined]":
        return `undefined`;
      case "[object Int8Array]":
      case "[object Uint8Array]":
      case "[object Uint8ClampedArray]":
      case "[object Int16Array]":
      case "[object Uint16Array]":
      case "[object Int32Array]":
      case "[object Uint32Array]":
      case "[object Float32Array]":
      case "[object Float64Array]":
      case "[object BigInt64Array]":
      case "[object BigUint64Array]": {
        if (typeof Buffer !== "undefined" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(value)) {
          return `Buffer.from(${stringifyInternal(Array.from(value.values()), currentValues, getAsyncContent)})`;
        }
        const valuePrototype = Object.getPrototypeOf(value);
        const className = valuePrototype && valuePrototype.constructor && valuePrototype.constructor.name;
        if (typeof className === "string") {
          const typedArray = value;
          const valuesFromTypedArr = typedArray.values();
          return `${className}.from(${stringifyInternal(Array.from(valuesFromTypedArr), currentValues, getAsyncContent)})`;
        }
        break;
      }
    }
    try {
      return value.toString();
    } catch (_a3) {
      return Object.prototype.toString.call(value);
    }
  }
  function stringify(value) {
    return stringifyInternal(value, [], () => ({ state: "unknown", value: void 0 }));
  }
  function possiblyAsyncStringify(value) {
    const stillPendingMarker = Symbol();
    const pendingPromisesForCache = [];
    const cache = /* @__PURE__ */ new Map();
    function createDelay0() {
      let handleId = null;
      const cancel = () => {
        if (handleId !== null) {
          clearTimeout(handleId);
        }
      };
      const delay = new Promise((resolve) => {
        handleId = setTimeout(() => {
          handleId = null;
          resolve(stillPendingMarker);
        }, 0);
      });
      return { delay, cancel };
    }
    const unknownState = { state: "unknown", value: void 0 };
    const getAsyncContent = function getAsyncContent2(data) {
      const cacheKey = data;
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }
      const delay0 = createDelay0();
      const p = asyncToStringMethod in data ? Promise.resolve().then(() => data[asyncToStringMethod]()) : data;
      p.catch(() => {
      });
      pendingPromisesForCache.push(Promise.race([p, delay0.delay]).then((successValue) => {
        if (successValue === stillPendingMarker)
          cache.set(cacheKey, { state: "pending", value: void 0 });
        else
          cache.set(cacheKey, { state: "fulfilled", value: successValue });
        delay0.cancel();
      }, (errorValue) => {
        cache.set(cacheKey, { state: "rejected", value: errorValue });
        delay0.cancel();
      }));
      cache.set(cacheKey, unknownState);
      return unknownState;
    };
    function loop() {
      const stringifiedValue = stringifyInternal(value, [], getAsyncContent);
      if (pendingPromisesForCache.length === 0) {
        return stringifiedValue;
      }
      return Promise.all(pendingPromisesForCache.splice(0)).then(loop);
    }
    return loop();
  }
  var toStringMethod, asyncToStringMethod, findSymbolNameRegex;
  var init_stringify = __esm({
    "node_modules/fast-check/lib/esm/utils/stringify.js"() {
      toStringMethod = Symbol("fast-check/toStringMethod");
      asyncToStringMethod = Symbol("fast-check/asyncToStringMethod");
      findSymbolNameRegex = /^Symbol\((.*)\)$/;
    }
  });

  // node_modules/fast-check/lib/esm/check/property/IgnoreEqualValuesProperty.js
  function fromSyncCached(cachedValue) {
    return cachedValue === null ? new PreconditionFailure() : cachedValue;
  }
  function fromCached(...data) {
    if (data[1])
      return data[0].then(fromSyncCached);
    return fromSyncCached(data[0]);
  }
  function fromCachedUnsafe(cachedValue, isAsync) {
    return fromCached(cachedValue, isAsync);
  }
  var IgnoreEqualValuesProperty;
  var init_IgnoreEqualValuesProperty = __esm({
    "node_modules/fast-check/lib/esm/check/property/IgnoreEqualValuesProperty.js"() {
      init_stringify();
      init_PreconditionFailure();
      IgnoreEqualValuesProperty = class {
        constructor(property2, skipRuns) {
          this.property = property2;
          this.skipRuns = skipRuns;
          this.coveredCases = /* @__PURE__ */ new Map();
          this.isAsync = () => this.property.isAsync();
          this.generate = (mrng, runId) => this.property.generate(mrng, runId);
          this.run = (v) => {
            const stringifiedValue = stringify(v);
            if (this.coveredCases.has(stringifiedValue)) {
              const lastOutput = this.coveredCases.get(stringifiedValue);
              if (!this.skipRuns) {
                return lastOutput;
              }
              return fromCachedUnsafe(lastOutput, this.property.isAsync());
            }
            const out = this.property.run(v);
            this.coveredCases.set(stringifiedValue, out);
            return out;
          };
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/check/runner/DecorateProperty.js
  function decorateProperty(rawProperty, qParams) {
    let prop = rawProperty;
    if (rawProperty.isAsync() && qParams.timeout != null) {
      prop = new TimeoutProperty(prop, qParams.timeout);
    }
    if (qParams.unbiased) {
      prop = new UnbiasedProperty(prop);
    }
    if (qParams.skipAllAfterTimeLimit != null) {
      prop = new SkipAfterProperty(prop, Date.now, qParams.skipAllAfterTimeLimit, false);
    }
    if (qParams.interruptAfterTimeLimit != null) {
      prop = new SkipAfterProperty(prop, Date.now, qParams.interruptAfterTimeLimit, true);
    }
    if (qParams.skipEqualValues) {
      prop = new IgnoreEqualValuesProperty(prop, true);
    }
    if (qParams.ignoreEqualValues) {
      prop = new IgnoreEqualValuesProperty(prop, false);
    }
    return prop;
  }
  var init_DecorateProperty = __esm({
    "node_modules/fast-check/lib/esm/check/runner/DecorateProperty.js"() {
      init_SkipAfterProperty();
      init_TimeoutProperty();
      init_UnbiasedProperty();
      init_IgnoreEqualValuesProperty();
    }
  });

  // node_modules/fast-check/lib/esm/check/runner/reporter/ExecutionStatus.js
  var ExecutionStatus;
  var init_ExecutionStatus = __esm({
    "node_modules/fast-check/lib/esm/check/runner/reporter/ExecutionStatus.js"() {
      (function(ExecutionStatus2) {
        ExecutionStatus2[ExecutionStatus2["Success"] = 0] = "Success";
        ExecutionStatus2[ExecutionStatus2["Skipped"] = -1] = "Skipped";
        ExecutionStatus2[ExecutionStatus2["Failure"] = 1] = "Failure";
      })(ExecutionStatus || (ExecutionStatus = {}));
    }
  });

  // node_modules/fast-check/lib/esm/check/runner/reporter/RunExecution.js
  var RunExecution;
  var init_RunExecution = __esm({
    "node_modules/fast-check/lib/esm/check/runner/reporter/RunExecution.js"() {
      init_VerbosityLevel();
      init_ExecutionStatus();
      RunExecution = class _RunExecution {
        constructor(verbosity, interruptedAsFailure) {
          this.verbosity = verbosity;
          this.interruptedAsFailure = interruptedAsFailure;
          this.isSuccess = () => this.pathToFailure == null;
          this.firstFailure = () => this.pathToFailure ? +this.pathToFailure.split(":")[0] : -1;
          this.numShrinks = () => this.pathToFailure ? this.pathToFailure.split(":").length - 1 : 0;
          this.rootExecutionTrees = [];
          this.currentLevelExecutionTrees = this.rootExecutionTrees;
          this.failure = null;
          this.numSkips = 0;
          this.numSuccesses = 0;
          this.interrupted = false;
        }
        appendExecutionTree(status, value) {
          const currentTree = { status, value, children: [] };
          this.currentLevelExecutionTrees.push(currentTree);
          return currentTree;
        }
        fail(value, id, message) {
          if (this.verbosity >= VerbosityLevel.Verbose) {
            const currentTree = this.appendExecutionTree(ExecutionStatus.Failure, value);
            this.currentLevelExecutionTrees = currentTree.children;
          }
          if (this.pathToFailure == null)
            this.pathToFailure = `${id}`;
          else
            this.pathToFailure += `:${id}`;
          this.value = value;
          this.failure = message;
        }
        skip(value) {
          if (this.verbosity >= VerbosityLevel.VeryVerbose) {
            this.appendExecutionTree(ExecutionStatus.Skipped, value);
          }
          if (this.pathToFailure == null) {
            ++this.numSkips;
          }
        }
        success(value) {
          if (this.verbosity >= VerbosityLevel.VeryVerbose) {
            this.appendExecutionTree(ExecutionStatus.Success, value);
          }
          if (this.pathToFailure == null) {
            ++this.numSuccesses;
          }
        }
        interrupt() {
          this.interrupted = true;
        }
        extractFailures() {
          if (this.isSuccess()) {
            return [];
          }
          const failures = [];
          let cursor = this.rootExecutionTrees;
          while (cursor.length > 0 && cursor[cursor.length - 1].status === ExecutionStatus.Failure) {
            const failureTree = cursor[cursor.length - 1];
            failures.push(failureTree.value);
            cursor = failureTree.children;
          }
          return failures;
        }
        toRunDetails(seed, basePath, maxSkips, qParams) {
          if (!this.isSuccess()) {
            return {
              failed: true,
              interrupted: this.interrupted,
              numRuns: this.firstFailure() + 1 - this.numSkips,
              numSkips: this.numSkips,
              numShrinks: this.numShrinks(),
              seed,
              counterexample: this.value,
              counterexamplePath: _RunExecution.mergePaths(basePath, this.pathToFailure),
              error: this.failure,
              failures: this.extractFailures(),
              executionSummary: this.rootExecutionTrees,
              verbose: this.verbosity,
              runConfiguration: qParams.toParameters()
            };
          }
          const failed2 = this.numSkips > maxSkips || this.interrupted && this.interruptedAsFailure;
          return {
            failed: failed2,
            interrupted: this.interrupted,
            numRuns: this.numSuccesses,
            numSkips: this.numSkips,
            numShrinks: 0,
            seed,
            counterexample: null,
            counterexamplePath: null,
            error: null,
            failures: [],
            executionSummary: this.rootExecutionTrees,
            verbose: this.verbosity,
            runConfiguration: qParams.toParameters()
          };
        }
      };
      RunExecution.mergePaths = (offsetPath, path) => {
        if (offsetPath.length === 0)
          return path;
        const offsetItems = offsetPath.split(":");
        const remainingItems = path.split(":");
        const middle = +offsetItems[offsetItems.length - 1] + +remainingItems[0];
        return [...offsetItems.slice(0, offsetItems.length - 1), `${middle}`, ...remainingItems.slice(1)].join(":");
      };
    }
  });

  // node_modules/fast-check/lib/esm/check/runner/RunnerIterator.js
  var RunnerIterator;
  var init_RunnerIterator = __esm({
    "node_modules/fast-check/lib/esm/check/runner/RunnerIterator.js"() {
      init_RunExecution();
      RunnerIterator = class {
        constructor(sourceValues, verbose, interruptedAsFailure) {
          this.sourceValues = sourceValues;
          this.runExecution = new RunExecution(verbose, interruptedAsFailure);
          this.currentIdx = -1;
          this.nextValues = sourceValues;
        }
        [Symbol.iterator]() {
          return this;
        }
        next() {
          const nextValue = this.nextValues.next();
          if (nextValue.done || this.runExecution.interrupted) {
            return { done: true, value: void 0 };
          }
          this.currentShrinkable = nextValue.value;
          ++this.currentIdx;
          return { done: false, value: nextValue.value.value_ };
        }
        handleResult(result) {
          if (result != null && typeof result === "string") {
            this.runExecution.fail(this.currentShrinkable.value_, this.currentIdx, result);
            this.currentIdx = -1;
            this.nextValues = this.currentShrinkable.shrink();
          } else if (result != null) {
            if (!result.interruptExecution) {
              this.runExecution.skip(this.currentShrinkable.value_);
              this.sourceValues.skippedOne();
            } else {
              this.runExecution.interrupt();
            }
          } else {
            this.runExecution.success(this.currentShrinkable.value_);
          }
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/check/runner/SourceValuesIterator.js
  var SourceValuesIterator;
  var init_SourceValuesIterator = __esm({
    "node_modules/fast-check/lib/esm/check/runner/SourceValuesIterator.js"() {
      SourceValuesIterator = class {
        constructor(initialValues, maxInitialIterations, remainingSkips) {
          this.initialValues = initialValues;
          this.maxInitialIterations = maxInitialIterations;
          this.remainingSkips = remainingSkips;
        }
        [Symbol.iterator]() {
          return this;
        }
        next() {
          if (--this.maxInitialIterations !== -1 && this.remainingSkips >= 0) {
            const n = this.initialValues.next();
            if (!n.done)
              return { value: n.value(), done: false };
          }
          return { value: void 0, done: true };
        }
        skippedOne() {
          --this.remainingSkips;
          ++this.maxInitialIterations;
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/random/generator/PureRandom.js
  function convertToRandomGenerator(rng) {
    if ("clone" in rng && "unsafeNext" in rng) {
      return rng;
    }
    return new ConvertedRandomGenerator(rng);
  }
  var ConvertedRandomGenerator;
  var init_PureRandom = __esm({
    "node_modules/fast-check/lib/esm/random/generator/PureRandom.js"() {
      ConvertedRandomGenerator = class _ConvertedRandomGenerator {
        constructor(rng) {
          this.rng = rng;
          if (typeof this.rng.jump === "function") {
            this.jump = function jump() {
              const out = this.jump();
              return new _ConvertedRandomGenerator(out);
            };
            this.unsafeJump = function unsafeJump() {
              const out = this.jump();
              this.rng = out;
            };
          }
        }
        min() {
          return this.rng.min();
        }
        max() {
          return this.rng.max();
        }
        clone() {
          return new _ConvertedRandomGenerator(this.rng);
        }
        next() {
          const out = this.rng.next();
          return [out[0], new _ConvertedRandomGenerator(out[1])];
        }
        unsafeNext() {
          const out = this.rng.next();
          this.rng = out[1];
          return out[0];
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/random/generator/Random.js
  var Random;
  var init_Random = __esm({
    "node_modules/fast-check/lib/esm/random/generator/Random.js"() {
      init_pure_rand();
      init_PureRandom();
      Random = class _Random {
        constructor(sourceRng) {
          this.internalRng = convertToRandomGenerator(sourceRng).clone();
        }
        clone() {
          return new _Random(this.internalRng);
        }
        next(bits) {
          return unsafeUniformIntDistribution(0, (1 << bits) - 1, this.internalRng);
        }
        nextBoolean() {
          return unsafeUniformIntDistribution(0, 1, this.internalRng) == 1;
        }
        nextInt(min, max) {
          return unsafeUniformIntDistribution(min == null ? _Random.MIN_INT : min, max == null ? _Random.MAX_INT : max, this.internalRng);
        }
        nextBigInt(min, max) {
          return unsafeUniformBigIntDistribution(min, max, this.internalRng);
        }
        nextArrayInt(min, max) {
          return unsafeUniformArrayIntDistribution(min, max, this.internalRng);
        }
        nextDouble() {
          const a = this.next(26);
          const b = this.next(27);
          return (a * _Random.DBL_FACTOR + b) * _Random.DBL_DIVISOR;
        }
      };
      Random.MIN_INT = 2147483648 | 0;
      Random.MAX_INT = 2147483647 | 0;
      Random.DBL_FACTOR = Math.pow(2, 27);
      Random.DBL_DIVISOR = Math.pow(2, -53);
    }
  });

  // node_modules/fast-check/lib/esm/check/runner/Tosser.js
  function lazyGenerate(generator, rng, idx) {
    return () => generator.generate(new Random(rng), idx);
  }
  function* toss(generator, seed, random, examples) {
    yield* examples.map((e2) => () => new Shrinkable(e2));
    let idx = 0;
    let rng = convertToRandomGenerator(random(seed));
    for (; ; ) {
      rng = rng.jump ? rng.jump() : skipN(rng, 42);
      yield lazyGenerate(generator, rng, idx++);
    }
  }
  var init_Tosser = __esm({
    "node_modules/fast-check/lib/esm/check/runner/Tosser.js"() {
      init_pure_rand();
      init_Random();
      init_Shrinkable();
      init_PureRandom();
    }
  });

  // node_modules/fast-check/lib/esm/check/runner/utils/PathWalker.js
  function pathWalk(path, initialValues) {
    let values = stream(initialValues);
    const segments = path.split(":").map((text) => +text);
    if (segments.length === 0)
      return values;
    if (!segments.every((v) => !Number.isNaN(v))) {
      throw new Error(`Unable to replay, got invalid path=${path}`);
    }
    values = values.drop(segments[0]);
    for (const s of segments.slice(1)) {
      const valueToShrink = values.getNthOrLast(0);
      if (valueToShrink == null) {
        throw new Error(`Unable to replay, got wrong path=${path}`);
      }
      values = valueToShrink.shrink().drop(s);
    }
    return values;
  }
  var init_PathWalker = __esm({
    "node_modules/fast-check/lib/esm/check/runner/utils/PathWalker.js"() {
      init_Stream();
    }
  });

  // node_modules/fast-check/lib/esm/check/runner/utils/RunDetailsFormatter.js
  function formatHints(hints) {
    if (hints.length === 1) {
      return `Hint: ${hints[0]}`;
    }
    return hints.map((h, idx) => `Hint (${idx + 1}): ${h}`).join("\n");
  }
  function formatFailures(failures, stringifyOne) {
    return `Encountered failures were:
- ${failures.map(stringifyOne).join("\n- ")}`;
  }
  function formatExecutionSummary(executionTrees, stringifyOne) {
    const summaryLines = [];
    const remainingTreesAndDepth = [];
    for (const tree of executionTrees.slice().reverse()) {
      remainingTreesAndDepth.push({ depth: 1, tree });
    }
    while (remainingTreesAndDepth.length !== 0) {
      const currentTreeAndDepth = remainingTreesAndDepth.pop();
      const currentTree = currentTreeAndDepth.tree;
      const currentDepth = currentTreeAndDepth.depth;
      const statusIcon = currentTree.status === ExecutionStatus.Success ? "\x1B[32m\u221A\x1B[0m" : currentTree.status === ExecutionStatus.Failure ? "\x1B[31m\xD7\x1B[0m" : "\x1B[33m!\x1B[0m";
      const leftPadding = Array(currentDepth).join(". ");
      summaryLines.push(`${leftPadding}${statusIcon} ${stringifyOne(currentTree.value)}`);
      for (const tree of currentTree.children.slice().reverse()) {
        remainingTreesAndDepth.push({ depth: currentDepth + 1, tree });
      }
    }
    return `Execution summary:
${summaryLines.join("\n")}`;
  }
  function preFormatTooManySkipped(out, stringifyOne) {
    const message = `Failed to run property, too many pre-condition failures encountered
{ seed: ${out.seed} }

Ran ${out.numRuns} time(s)
Skipped ${out.numSkips} time(s)`;
    let details = null;
    const hints = [
      "Try to reduce the number of rejected values by combining map, flatMap and built-in arbitraries",
      "Increase failure tolerance by setting maxSkipsPerRun to an higher value"
    ];
    if (out.verbose >= VerbosityLevel.VeryVerbose) {
      details = formatExecutionSummary(out.executionSummary, stringifyOne);
    } else {
      hints.push("Enable verbose mode at level VeryVerbose in order to check all generated values and their associated status");
    }
    return { message, details, hints };
  }
  function preFormatFailure(out, stringifyOne) {
    const message = `Property failed after ${out.numRuns} tests
{ seed: ${out.seed}, path: "${out.counterexamplePath}", endOnFailure: true }
Counterexample: ${stringifyOne(out.counterexample)}
Shrunk ${out.numShrinks} time(s)
Got error: ${out.error}`;
    let details = null;
    const hints = [];
    if (out.verbose >= VerbosityLevel.VeryVerbose) {
      details = formatExecutionSummary(out.executionSummary, stringifyOne);
    } else if (out.verbose === VerbosityLevel.Verbose) {
      details = formatFailures(out.failures, stringifyOne);
    } else {
      hints.push("Enable verbose mode in order to have the list of all failing values encountered during the run");
    }
    return { message, details, hints };
  }
  function preFormatEarlyInterrupted(out, stringifyOne) {
    const message = `Property interrupted after ${out.numRuns} tests
{ seed: ${out.seed} }`;
    let details = null;
    const hints = [];
    if (out.verbose >= VerbosityLevel.VeryVerbose) {
      details = formatExecutionSummary(out.executionSummary, stringifyOne);
    } else {
      hints.push("Enable verbose mode at level VeryVerbose in order to check all generated values and their associated status");
    }
    return { message, details, hints };
  }
  function defaultReportMessageInternal(out, stringifyOne) {
    if (!out.failed)
      return;
    const { message, details, hints } = out.counterexamplePath === null ? out.interrupted ? preFormatEarlyInterrupted(out, stringifyOne) : preFormatTooManySkipped(out, stringifyOne) : preFormatFailure(out, stringifyOne);
    let errorMessage = message;
    if (details != null)
      errorMessage += `

${details}`;
    if (hints.length > 0)
      errorMessage += `

${formatHints(hints)}`;
    return errorMessage;
  }
  function defaultReportMessage(out) {
    return defaultReportMessageInternal(out, stringify);
  }
  async function asyncDefaultReportMessage(out) {
    const pendingStringifieds = [];
    function stringifyOne(value) {
      const stringified = possiblyAsyncStringify(value);
      if (typeof stringified === "string") {
        return stringified;
      }
      pendingStringifieds.push(Promise.all([value, stringified]));
      return "\u2026";
    }
    const firstTryMessage = defaultReportMessageInternal(out, stringifyOne);
    if (pendingStringifieds.length === 0) {
      return firstTryMessage;
    }
    const registeredValues = new Map(await Promise.all(pendingStringifieds));
    function stringifySecond(value) {
      const asyncStringifiedIfRegistered = registeredValues.get(value);
      if (asyncStringifiedIfRegistered !== void 0) {
        return asyncStringifiedIfRegistered;
      }
      return stringify(value);
    }
    return defaultReportMessageInternal(out, stringifySecond);
  }
  function throwIfFailed(out) {
    if (!out.failed)
      return;
    throw new Error(defaultReportMessage(out));
  }
  async function asyncThrowIfFailed(out) {
    if (!out.failed)
      return;
    throw new Error(await asyncDefaultReportMessage(out));
  }
  function reportRunDetails(out) {
    if (out.runConfiguration.asyncReporter)
      return out.runConfiguration.asyncReporter(out);
    else if (out.runConfiguration.reporter)
      return out.runConfiguration.reporter(out);
    else
      return throwIfFailed(out);
  }
  async function asyncReportRunDetails(out) {
    if (out.runConfiguration.asyncReporter)
      return out.runConfiguration.asyncReporter(out);
    else if (out.runConfiguration.reporter)
      return out.runConfiguration.reporter(out);
    else
      return asyncThrowIfFailed(out);
  }
  var init_RunDetailsFormatter = __esm({
    "node_modules/fast-check/lib/esm/check/runner/utils/RunDetailsFormatter.js"() {
      init_stringify();
      init_VerbosityLevel();
      init_ExecutionStatus();
    }
  });

  // node_modules/fast-check/lib/esm/check/runner/Runner.js
  function runIt(property2, sourceValues, verbose, interruptedAsFailure) {
    const runner = new RunnerIterator(sourceValues, verbose, interruptedAsFailure);
    for (const v of runner) {
      const out = property2.run(v);
      runner.handleResult(out);
    }
    return runner.runExecution;
  }
  async function asyncRunIt(property2, sourceValues, verbose, interruptedAsFailure) {
    const runner = new RunnerIterator(sourceValues, verbose, interruptedAsFailure);
    for (const v of runner) {
      const out = await property2.run(v);
      runner.handleResult(out);
    }
    return runner.runExecution;
  }
  function runnerPathWalker(valueProducers, path) {
    const pathPoints = path.split(":");
    const pathStream = stream(valueProducers).drop(pathPoints.length > 0 ? +pathPoints[0] : 0).map((producer) => producer());
    const adaptedPath = ["0", ...pathPoints.slice(1)].join(":");
    return stream(pathWalk(adaptedPath, pathStream)).map((v) => () => v);
  }
  function buildInitialValues(valueProducers, qParams) {
    const rawValues = qParams.path.length === 0 ? stream(valueProducers) : runnerPathWalker(valueProducers, qParams.path);
    if (!qParams.endOnFailure)
      return rawValues;
    return rawValues.map((shrinkableGen) => {
      return () => {
        const s = shrinkableGen();
        return new Shrinkable(s.value_);
      };
    });
  }
  function check(rawProperty, params) {
    if (rawProperty == null || rawProperty.generate == null)
      throw new Error("Invalid property encountered, please use a valid property");
    if (rawProperty.run == null)
      throw new Error("Invalid property encountered, please use a valid property not an arbitrary");
    const qParams = QualifiedParameters.read(Object.assign(Object.assign({}, readConfigureGlobal()), params));
    if (qParams.reporter !== null && qParams.asyncReporter !== null)
      throw new Error("Invalid parameters encountered, reporter and asyncReporter cannot be specified together");
    if (qParams.asyncReporter !== null && !rawProperty.isAsync())
      throw new Error("Invalid parameters encountered, only asyncProperty can be used when asyncReporter specified");
    const property2 = decorateProperty(rawProperty, qParams);
    const generator = toss(property2, qParams.seed, qParams.randomType, qParams.examples);
    const maxInitialIterations = qParams.path.indexOf(":") === -1 ? qParams.numRuns : -1;
    const maxSkips = qParams.numRuns * qParams.maxSkipsPerRun;
    const initialValues = buildInitialValues(generator, qParams);
    const sourceValues = new SourceValuesIterator(initialValues, maxInitialIterations, maxSkips);
    return property2.isAsync() ? asyncRunIt(property2, sourceValues, qParams.verbose, qParams.markInterruptAsFailure).then((e2) => e2.toRunDetails(qParams.seed, qParams.path, maxSkips, qParams)) : runIt(property2, sourceValues, qParams.verbose, qParams.markInterruptAsFailure).toRunDetails(qParams.seed, qParams.path, maxSkips, qParams);
  }
  function assert(property2, params) {
    const out = check(property2, params);
    if (property2.isAsync())
      return out.then(asyncReportRunDetails);
    else
      reportRunDetails(out);
  }
  var init_Runner = __esm({
    "node_modules/fast-check/lib/esm/check/runner/Runner.js"() {
      init_Stream();
      init_Shrinkable();
      init_GlobalParameters();
      init_QualifiedParameters();
      init_DecorateProperty();
      init_RunnerIterator();
      init_SourceValuesIterator();
      init_Tosser();
      init_PathWalker();
      init_RunDetailsFormatter();
    }
  });

  // node_modules/fast-check/lib/esm/check/runner/Sampler.js
  var init_Sampler = __esm({
    "node_modules/fast-check/lib/esm/check/runner/Sampler.js"() {
      init_Stream();
      init_Property_generic();
      init_UnbiasedProperty();
      init_GlobalParameters();
      init_QualifiedParameters();
      init_Tosser();
      init_PathWalker();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/BiasNumericRange.js
  function integerLogLike(v) {
    return Math.floor(Math.log(v) / Math.log(2));
  }
  function biasNumericRange(min, max, logLike) {
    if (min === max) {
      return [{ min, max }];
    }
    if (min < 0 && max > 0) {
      const logMin = logLike(-min);
      const logMax = logLike(max);
      return [
        { min: -logMin, max: logMax },
        { min: max - logMax, max },
        { min, max: min + logMin }
      ];
    }
    const logGap = logLike(max - min);
    const arbCloseToMin = { min, max: min + logGap };
    const arbCloseToMax = { min: max - logGap, max };
    return min < 0 ? [arbCloseToMax, arbCloseToMin] : [arbCloseToMin, arbCloseToMax];
  }
  var init_BiasNumericRange = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/BiasNumericRange.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/ShrinkInteger.js
  function halvePosInteger(n) {
    return Math.floor(n / 2);
  }
  function halveNegInteger(n) {
    return Math.ceil(n / 2);
  }
  function shrinkInteger(current, target, tryTargetAsap) {
    const realGap = current - target;
    function* shrinkDecr() {
      let previous = tryTargetAsap ? void 0 : target;
      const gap = tryTargetAsap ? realGap : halvePosInteger(realGap);
      for (let toremove = gap; toremove > 0; toremove = halvePosInteger(toremove)) {
        const next = toremove === realGap ? target : current - toremove;
        yield new NextValue(next, previous);
        previous = next;
      }
    }
    function* shrinkIncr() {
      let previous = tryTargetAsap ? void 0 : target;
      const gap = tryTargetAsap ? realGap : halveNegInteger(realGap);
      for (let toremove = gap; toremove < 0; toremove = halveNegInteger(toremove)) {
        const next = toremove === realGap ? target : current - toremove;
        yield new NextValue(next, previous);
        previous = next;
      }
    }
    return realGap > 0 ? stream(shrinkDecr()) : stream(shrinkIncr());
  }
  var init_ShrinkInteger = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/ShrinkInteger.js"() {
      init_NextValue();
      init_Stream();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/IntegerArbitrary.js
  var IntegerArbitrary;
  var init_IntegerArbitrary = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/IntegerArbitrary.js"() {
      init_NextArbitrary();
      init_NextValue();
      init_Stream();
      init_BiasNumericRange();
      init_ShrinkInteger();
      IntegerArbitrary = class _IntegerArbitrary extends NextArbitrary {
        constructor(min, max) {
          super();
          this.min = min;
          this.max = max;
        }
        generate(mrng, biasFactor) {
          const range = this.computeGenerateRange(mrng, biasFactor);
          return new NextValue(mrng.nextInt(range.min, range.max), void 0);
        }
        canShrinkWithoutContext(value) {
          return typeof value === "number" && Number.isInteger(value) && !Object.is(value, -0) && this.min <= value && value <= this.max;
        }
        shrink(current, context2) {
          if (!_IntegerArbitrary.isValidContext(current, context2)) {
            const target = this.defaultTarget();
            return shrinkInteger(current, target, true);
          }
          if (this.isLastChanceTry(current, context2)) {
            return Stream.of(new NextValue(context2, void 0));
          }
          return shrinkInteger(current, context2, false);
        }
        defaultTarget() {
          if (this.min <= 0 && this.max >= 0) {
            return 0;
          }
          return this.min < 0 ? this.max : this.min;
        }
        computeGenerateRange(mrng, biasFactor) {
          if (biasFactor === void 0 || mrng.nextInt(1, biasFactor) !== 1) {
            return { min: this.min, max: this.max };
          }
          const ranges = biasNumericRange(this.min, this.max, integerLogLike);
          if (ranges.length === 1) {
            return ranges[0];
          }
          const id = mrng.nextInt(-2 * (ranges.length - 1), ranges.length - 2);
          return id < 0 ? ranges[0] : ranges[id + 1];
        }
        isLastChanceTry(current, context2) {
          if (current > 0)
            return current === context2 + 1 && current > this.min;
          if (current < 0)
            return current === context2 - 1 && current < this.max;
          return false;
        }
        static isValidContext(current, context2) {
          if (context2 === void 0) {
            return false;
          }
          if (typeof context2 !== "number") {
            throw new Error(`Invalid context type passed to IntegerArbitrary (#1)`);
          }
          if (context2 !== 0 && Math.sign(current) !== Math.sign(context2)) {
            throw new Error(`Invalid context value passed to IntegerArbitrary (#2)`);
          }
          return true;
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/integer.js
  function buildCompleteIntegerConstraints(constraints) {
    const min = constraints.min !== void 0 ? constraints.min : -2147483648;
    const max = constraints.max !== void 0 ? constraints.max : 2147483647;
    return { min, max };
  }
  function extractIntegerConstraints(args) {
    if (args[0] === void 0) {
      return {};
    }
    if (args[1] === void 0) {
      const sargs2 = args;
      if (typeof sargs2[0] === "number")
        return { max: sargs2[0] };
      return sargs2[0];
    }
    const sargs = args;
    return { min: sargs[0], max: sargs[1] };
  }
  function integer(...args) {
    const constraints = buildCompleteIntegerConstraints(extractIntegerConstraints(args));
    if (constraints.min > constraints.max) {
      throw new Error("fc.integer maximum value should be equal or greater than the minimum one");
    }
    const arb = new IntegerArbitrary(constraints.min, constraints.max);
    return convertFromNextWithShrunkOnce(arb, arb.defaultTarget());
  }
  var init_integer = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/integer.js"() {
      init_Converters();
      init_IntegerArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/stream/LazyIterableIterator.js
  var LazyIterableIterator;
  var init_LazyIterableIterator = __esm({
    "node_modules/fast-check/lib/esm/stream/LazyIterableIterator.js"() {
      LazyIterableIterator = class {
        constructor(producer) {
          this.producer = producer;
        }
        [Symbol.iterator]() {
          if (this.it === void 0) {
            this.it = this.producer();
          }
          return this.it;
        }
        next() {
          if (this.it === void 0) {
            this.it = this.producer();
          }
          return this.it.next();
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/BuildCompareFilter.js
  var init_BuildCompareFilter = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/BuildCompareFilter.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/ArrayArbitrary.js
  var init_ArrayArbitrary = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/ArrayArbitrary.js"() {
      init_Stream();
      init_symbols();
      init_integer();
      init_LazyIterableIterator();
      init_BuildCompareFilter();
      init_NextArbitrary();
      init_Converters();
      init_NextValue();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/MaxLengthFromMinLength.js
  var init_MaxLengthFromMinLength = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/MaxLengthFromMinLength.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/array.js
  var init_array = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/array.js"() {
      init_Converters();
      init_ArrayArbitrary();
      init_MaxLengthFromMinLength();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/ShrinkBigInt.js
  var init_ShrinkBigInt = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/ShrinkBigInt.js"() {
      init_Stream();
      init_NextValue();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/BigIntArbitrary.js
  var init_BigIntArbitrary = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/BigIntArbitrary.js"() {
      init_Stream();
      init_NextArbitrary();
      init_NextValue();
      init_BiasNumericRange();
      init_ShrinkBigInt();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/bigInt.js
  var init_bigInt = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/bigInt.js"() {
      init_Converters();
      init_BigIntArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/bigIntN.js
  var init_bigIntN = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/bigIntN.js"() {
      init_Converters();
      init_BigIntArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/bigUint.js
  var init_bigUint = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/bigUint.js"() {
      init_Converters();
      init_BigIntArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/bigUintN.js
  var init_bigUintN = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/bigUintN.js"() {
      init_Converters();
      init_BigIntArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/boolean.js
  var init_boolean = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/boolean.js"() {
      init_Converters();
      init_integer();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/ConstantArbitrary.js
  var ConstantArbitrary;
  var init_ConstantArbitrary = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/ConstantArbitrary.js"() {
      init_Stream();
      init_NextArbitrary();
      init_NextValue();
      init_symbols();
      ConstantArbitrary = class extends NextArbitrary {
        constructor(values) {
          super();
          this.values = values;
        }
        generate(mrng, _biasFactor) {
          const idx = this.values.length === 1 ? 0 : mrng.nextInt(0, this.values.length - 1);
          const value = this.values[idx];
          if (!hasCloneMethod(value)) {
            return new NextValue(value, idx);
          }
          return new NextValue(value, idx, () => value[cloneMethod]());
        }
        canShrinkWithoutContext(value) {
          for (let idx = 0; idx !== this.values.length; ++idx) {
            if (Object.is(this.values[idx], value)) {
              return true;
            }
          }
          return false;
        }
        shrink(value, context2) {
          if (context2 === 0 || Object.is(value, this.values[0])) {
            return Stream.nil();
          }
          return Stream.of(new NextValue(this.values[0], 0));
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/constantFrom.js
  function constantFrom(...values) {
    if (values.length === 0) {
      throw new Error("fc.constantFrom expects at least one parameter");
    }
    return convertFromNext(new ConstantArbitrary(values));
  }
  var init_constantFrom = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/constantFrom.js"() {
      init_Converters();
      init_ConstantArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/falsy.js
  var init_falsy = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/falsy.js"() {
      init_constantFrom();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/IndexToCharString.js
  function indexToCharStringUnmapper(c) {
    if (typeof c !== "string") {
      throw new Error("Cannot unmap non-string");
    }
    if (c.length === 0 || c.length > 2) {
      throw new Error("Cannot unmap string with more or less than one character");
    }
    const c1 = c.charCodeAt(0);
    if (c.length === 1) {
      return c1;
    }
    const c2 = c.charCodeAt(1);
    if (c1 < 55296 || c1 > 56319 || c2 < 56320 || c2 > 57343) {
      throw new Error("Cannot unmap invalid surrogate pairs");
    }
    return c.codePointAt(0);
  }
  var indexToCharStringMapper;
  var init_IndexToCharString = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/IndexToCharString.js"() {
      indexToCharStringMapper = String.fromCodePoint;
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/builders/CharacterArbitraryBuilder.js
  function buildCharacterArbitrary(min, max, mapToCode, unmapFromCode) {
    return convertFromNext(convertToNext(integer(min, max)).map((n) => indexToCharStringMapper(mapToCode(n)), (c) => unmapFromCode(indexToCharStringUnmapper(c))));
  }
  var init_CharacterArbitraryBuilder = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/builders/CharacterArbitraryBuilder.js"() {
      init_Converters();
      init_integer();
      init_IndexToCharString();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/IndexToPrintableIndex.js
  function indexToPrintableIndexMapper(v) {
    if (v < 95)
      return v + 32;
    if (v <= 126)
      return v - 95;
    return v;
  }
  function indexToPrintableIndexUnmapper(v) {
    if (v >= 32 && v <= 126)
      return v - 32;
    if (v >= 0 && v <= 31)
      return v + 95;
    return v;
  }
  var init_IndexToPrintableIndex = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/IndexToPrintableIndex.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/ascii.js
  var init_ascii = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/ascii.js"() {
      init_CharacterArbitraryBuilder();
      init_IndexToPrintableIndex();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/base64.js
  var init_base64 = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/base64.js"() {
      init_CharacterArbitraryBuilder();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/char.js
  var init_char = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/char.js"() {
      init_CharacterArbitraryBuilder();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/char16bits.js
  var init_char16bits = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/char16bits.js"() {
      init_CharacterArbitraryBuilder();
      init_IndexToPrintableIndex();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/fullUnicode.js
  function unicodeMapper(v) {
    if (v < 55296)
      return indexToPrintableIndexMapper(v);
    return v + gapSize;
  }
  function unicodeUnmapper(v) {
    if (v < 55296)
      return indexToPrintableIndexUnmapper(v);
    if (v <= 57343)
      return -1;
    return v - gapSize;
  }
  function fullUnicode() {
    return buildCharacterArbitrary(0, 1114111 - gapSize, unicodeMapper, unicodeUnmapper);
  }
  var gapSize;
  var init_fullUnicode = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/fullUnicode.js"() {
      init_CharacterArbitraryBuilder();
      init_IndexToPrintableIndex();
      gapSize = 57343 + 1 - 55296;
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/hexa.js
  var init_hexa = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/hexa.js"() {
      init_CharacterArbitraryBuilder();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/unicode.js
  var gapSize2;
  var init_unicode = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/unicode.js"() {
      init_CharacterArbitraryBuilder();
      init_IndexToPrintableIndex();
      gapSize2 = 57343 + 1 - 55296;
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/constant.js
  var init_constant = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/constant.js"() {
      init_Converters();
      init_ConstantArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/clonedConstant.js
  var init_clonedConstant = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/clonedConstant.js"() {
      init_constant();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/context.js
  var ContextImplem;
  var init_context = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/context.js"() {
      init_symbols();
      init_constant();
      ContextImplem = class _ContextImplem {
        constructor() {
          this.receivedLogs = [];
        }
        log(data) {
          this.receivedLogs.push(data);
        }
        size() {
          return this.receivedLogs.length;
        }
        toString() {
          return JSON.stringify({ logs: this.receivedLogs });
        }
        [cloneMethod]() {
          return new _ContextImplem();
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/TimeToDate.js
  var init_TimeToDate = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/TimeToDate.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/date.js
  var init_date = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/date.js"() {
      init_Converters();
      init_integer();
      init_TimeToDate();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/CloneArbitrary.js
  var init_CloneArbitrary = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/CloneArbitrary.js"() {
      init_NextArbitrary();
      init_NextValue();
      init_symbols();
      init_Stream();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/clone.js
  var init_clone = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/clone.js"() {
      init_Converters();
      init_CloneArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/dedup.js
  var init_dedup = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/dedup.js"() {
      init_clone();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/set.js
  var init_set = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/set.js"() {
      init_ArrayArbitrary();
      init_Converters();
      init_MaxLengthFromMinLength();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/tuple.js
  function tuple(...arbs) {
    const nextArbs = arbs.map((arb) => convertToNext(arb));
    return convertFromNext(new TupleArbitrary(nextArbs));
  }
  var init_tuple = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/tuple.js"() {
      init_Converters();
      init_TupleArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/KeyValuePairsToObject.js
  var init_KeyValuePairsToObject = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/KeyValuePairsToObject.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/dictionary.js
  var init_dictionary = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/dictionary.js"() {
      init_Converters();
      init_set();
      init_tuple();
      init_KeyValuePairsToObject();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/DepthContext.js
  function getDepthContextFor(contextMeta) {
    if (contextMeta === void 0) {
      return { depth: 0 };
    }
    if (typeof contextMeta !== "string") {
      return contextMeta;
    }
    const cachedContext = depthContextCache.get(contextMeta);
    if (cachedContext !== void 0) {
      return cachedContext;
    }
    const context2 = { depth: 0 };
    depthContextCache.set(contextMeta, context2);
    return context2;
  }
  var depthContextCache;
  var init_DepthContext = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/DepthContext.js"() {
      depthContextCache = /* @__PURE__ */ new Map();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/FrequencyArbitrary.js
  var FrequencyArbitrary;
  var init_FrequencyArbitrary = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/FrequencyArbitrary.js"() {
      init_Stream();
      init_Converters();
      init_NextArbitrary();
      init_NextValue();
      init_DepthContext();
      FrequencyArbitrary = class _FrequencyArbitrary extends NextArbitrary {
        constructor(warbs, constraints, context2) {
          super();
          this.warbs = warbs;
          this.constraints = constraints;
          this.context = context2;
          let currentWeight = 0;
          this.cumulatedWeights = [];
          for (let idx = 0; idx !== warbs.length; ++idx) {
            currentWeight += warbs[idx].weight;
            this.cumulatedWeights.push(currentWeight);
          }
          this.totalWeight = currentWeight;
        }
        static fromOld(warbs, constraints, label) {
          return convertFromNext(_FrequencyArbitrary.from(warbs.map((w) => Object.assign(Object.assign({}, w), { arbitrary: convertToNext(w.arbitrary) })), constraints, label));
        }
        static from(warbs, constraints, label) {
          if (warbs.length === 0) {
            throw new Error(`${label} expects at least one weigthed arbitrary`);
          }
          let totalWeight = 0;
          for (let idx = 0; idx !== warbs.length; ++idx) {
            const currentArbitrary = warbs[idx].arbitrary;
            if (currentArbitrary === void 0) {
              throw new Error(`${label} expects arbitraries to be specified`);
            }
            const currentWeight = warbs[idx].weight;
            totalWeight += currentWeight;
            if (!Number.isInteger(currentWeight)) {
              throw new Error(`${label} expects weights to be integer values`);
            }
            if (currentWeight < 0) {
              throw new Error(`${label} expects weights to be superior or equal to 0`);
            }
          }
          if (totalWeight <= 0) {
            throw new Error(`${label} expects the sum of weights to be strictly superior to 0`);
          }
          return new _FrequencyArbitrary(warbs, constraints, getDepthContextFor(constraints.depthIdentifier));
        }
        generate(mrng, biasFactor) {
          if (this.mustGenerateFirst()) {
            return this.safeGenerateForIndex(mrng, 0, biasFactor);
          }
          const selected = mrng.nextInt(this.computeNegDepthBenefit(), this.totalWeight - 1);
          for (let idx = 0; idx !== this.cumulatedWeights.length; ++idx) {
            if (selected < this.cumulatedWeights[idx]) {
              return this.safeGenerateForIndex(mrng, idx, biasFactor);
            }
          }
          throw new Error(`Unable to generate from fc.frequency`);
        }
        canShrinkWithoutContext(value) {
          return this.canShrinkWithoutContextIndex(value) !== -1;
        }
        shrink(value, context2) {
          if (context2 !== void 0) {
            const safeContext = context2;
            const selectedIndex = safeContext.selectedIndex;
            const originalBias = safeContext.originalBias;
            const originalArbitrary = this.warbs[selectedIndex].arbitrary;
            const originalShrinks = originalArbitrary.shrink(value, safeContext.originalContext).map((v) => this.mapIntoNextValue(selectedIndex, v, null, originalBias));
            if (safeContext.clonedMrngForFallbackFirst !== null) {
              if (safeContext.cachedGeneratedForFirst === void 0) {
                safeContext.cachedGeneratedForFirst = this.safeGenerateForIndex(safeContext.clonedMrngForFallbackFirst, 0, originalBias);
              }
              const valueFromFirst = safeContext.cachedGeneratedForFirst;
              return Stream.of(valueFromFirst).join(originalShrinks);
            }
            return originalShrinks;
          }
          const potentialSelectedIndex = this.canShrinkWithoutContextIndex(value);
          if (potentialSelectedIndex === -1) {
            return Stream.nil();
          }
          return this.defaultShrinkForFirst(potentialSelectedIndex).join(this.warbs[potentialSelectedIndex].arbitrary.shrink(value, void 0).map((v) => this.mapIntoNextValue(potentialSelectedIndex, v, null, void 0)));
        }
        defaultShrinkForFirst(selectedIndex) {
          ++this.context.depth;
          try {
            if (!this.mustFallbackToFirstInShrink(selectedIndex) || this.warbs[0].fallbackValue === void 0) {
              return Stream.nil();
            }
          } finally {
            --this.context.depth;
          }
          const rawShrinkValue = new NextValue(this.warbs[0].fallbackValue.default, void 0);
          return Stream.of(this.mapIntoNextValue(0, rawShrinkValue, null, void 0));
        }
        canShrinkWithoutContextIndex(value) {
          if (this.mustGenerateFirst()) {
            return this.warbs[0].arbitrary.canShrinkWithoutContext(value) ? 0 : -1;
          }
          try {
            ++this.context.depth;
            for (let idx = 0; idx !== this.warbs.length; ++idx) {
              const warb = this.warbs[idx];
              if (warb.weight !== 0 && warb.arbitrary.canShrinkWithoutContext(value)) {
                return idx;
              }
            }
            return -1;
          } finally {
            --this.context.depth;
          }
        }
        mapIntoNextValue(idx, value, clonedMrngForFallbackFirst, biasFactor) {
          const context2 = {
            selectedIndex: idx,
            originalBias: biasFactor,
            originalContext: value.context,
            clonedMrngForFallbackFirst
          };
          return new NextValue(value.value, context2);
        }
        safeGenerateForIndex(mrng, idx, biasFactor) {
          ++this.context.depth;
          try {
            const value = this.warbs[idx].arbitrary.generate(mrng, biasFactor);
            const clonedMrngForFallbackFirst = this.mustFallbackToFirstInShrink(idx) ? mrng.clone() : null;
            return this.mapIntoNextValue(idx, value, clonedMrngForFallbackFirst, biasFactor);
          } finally {
            --this.context.depth;
          }
        }
        mustGenerateFirst() {
          return this.constraints.maxDepth !== void 0 && this.constraints.maxDepth <= this.context.depth;
        }
        mustFallbackToFirstInShrink(idx) {
          return idx !== 0 && !!this.constraints.withCrossShrink && this.warbs[0].weight !== 0;
        }
        computeNegDepthBenefit() {
          const depthFactor = this.constraints.depthFactor;
          if (depthFactor === void 0 || depthFactor <= 0) {
            return 0;
          }
          const depthBenefit = Math.floor(Math.pow(1 + depthFactor, this.context.depth)) - 1;
          return -Math.min(this.warbs[0].weight * depthBenefit, Number.MAX_SAFE_INTEGER) || 0;
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/frequency.js
  var init_frequency = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/frequency.js"() {
      init_FrequencyArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/nat.js
  var init_nat = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/nat.js"() {
      init_Converters();
      init_IntegerArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/IndexToMappedConstant.js
  var init_IndexToMappedConstant = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/IndexToMappedConstant.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/mapToConstant.js
  var init_mapToConstant = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/mapToConstant.js"() {
      init_Converters();
      init_nat();
      init_IndexToMappedConstant();
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/helpers/SpecificCharacterRange.js
  var percentCharArb;
  var init_SpecificCharacterRange = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/helpers/SpecificCharacterRange.js"() {
      init_fullUnicode();
      init_frequency();
      init_mapToConstant();
      percentCharArb = fullUnicode().map((c) => {
        const encoded = encodeURIComponent(c);
        return c !== encoded ? encoded : `%${c.charCodeAt(0).toString(16)}`;
      });
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/option.js
  var init_option = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/option.js"() {
      init_constant();
      init_FrequencyArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/StringConstraintsExtractor.js
  var init_StringConstraintsExtractor = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/StringConstraintsExtractor.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/PatternsToString.js
  var init_PatternsToString = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/PatternsToString.js"() {
      init_MaxLengthFromMinLength();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/stringOf.js
  var init_stringOf = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/stringOf.js"() {
      init_Converters();
      init_array();
      init_StringConstraintsExtractor();
      init_PatternsToString();
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/HostArbitrary.js
  var init_HostArbitrary = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/HostArbitrary.js"() {
      init_array();
      init_SpecificCharacterRange();
      init_option();
      init_stringOf();
      init_tuple();
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/EmailArbitrary.js
  var init_EmailArbitrary = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/EmailArbitrary.js"() {
      init_array();
      init_SpecificCharacterRange();
      init_HostArbitrary();
      init_stringOf();
      init_tuple();
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/helpers/ArrayInt64.js
  var init_ArrayInt64 = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/helpers/ArrayInt64.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/helpers/ArrayInt64Arbitrary.js
  var init_ArrayInt64Arbitrary = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/helpers/ArrayInt64Arbitrary.js"() {
      init_Stream();
      init_Converters();
      init_NextArbitrary();
      init_NextValue();
      init_ArrayInt64();
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/DoubleNextArbitrary.js
  var init_DoubleNextArbitrary = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/DoubleNextArbitrary.js"() {
      init_ArrayInt64();
      init_ArrayInt64Arbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/FloatNextArbitrary.js
  var MIN_VALUE_32, MAX_VALUE_32, EPSILON_32;
  var init_FloatNextArbitrary = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/FloatNextArbitrary.js"() {
      init_integer();
      MIN_VALUE_32 = 2 ** -126 * 2 ** -23;
      MAX_VALUE_32 = 2 ** 127 * (1 + (2 ** 23 - 1) / 2 ** 23);
      EPSILON_32 = 2 ** -23;
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/FloatingPointArbitrary.js
  var doubleFactor, doubleDivisor;
  var init_FloatingPointArbitrary = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/FloatingPointArbitrary.js"() {
      init_DoubleNextArbitrary();
      init_FloatNextArbitrary();
      init_integer();
      init_tuple();
      doubleFactor = Math.pow(2, 27);
      doubleDivisor = Math.pow(2, -53);
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/helpers/TextEscaper.js
  function escapeForTemplateString(originalText) {
    return originalText.replace(/([$`\\])/g, "\\$1").replace(/\r/g, "\\r");
  }
  var init_TextEscaper = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/helpers/TextEscaper.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/utils/hash.js
  var init_hash = __esm({
    "node_modules/fast-check/lib/esm/utils/hash.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/builders/CompareFunctionArbitraryBuilder.js
  var init_CompareFunctionArbitraryBuilder = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/builders/CompareFunctionArbitraryBuilder.js"() {
      init_TextEscaper();
      init_symbols();
      init_hash();
      init_stringify();
      init_integer();
      init_tuple();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/compareBooleanFunc.js
  var init_compareBooleanFunc = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/compareBooleanFunc.js"() {
      init_CompareFunctionArbitraryBuilder();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/compareFunc.js
  var init_compareFunc = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/compareFunc.js"() {
      init_CompareFunctionArbitraryBuilder();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/func.js
  var init_func = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/func.js"() {
      init_hash();
      init_stringify();
      init_symbols();
      init_array();
      init_integer();
      init_tuple();
      init_TextEscaper();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/maxSafeInteger.js
  var init_maxSafeInteger = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/maxSafeInteger.js"() {
      init_Converters();
      init_IntegerArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/maxSafeNat.js
  var init_maxSafeNat = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/maxSafeNat.js"() {
      init_Converters();
      init_IntegerArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/NatToStringifiedNat.js
  var init_NatToStringifiedNat = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/NatToStringifiedNat.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/ipV4.js
  var init_ipV4 = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/ipV4.js"() {
      init_Converters();
      init_nat();
      init_tuple();
      init_NatToStringifiedNat();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/oneof.js
  function isOneOfContraints(param) {
    return param != null && typeof param === "object" && !("generate" in param);
  }
  function oneof(...args) {
    const constraints = args[0];
    if (isOneOfContraints(constraints)) {
      const weightedArbs2 = args.slice(1).map((arbitrary) => ({ arbitrary, weight: 1 }));
      return FrequencyArbitrary.fromOld(weightedArbs2, constraints, "fc.oneof");
    }
    const weightedArbs = args.map((arbitrary) => ({ arbitrary, weight: 1 }));
    return FrequencyArbitrary.fromOld(weightedArbs, {}, "fc.oneof");
  }
  var init_oneof = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/oneof.js"() {
      init_FrequencyArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/builders/StringifiedNatArbitraryBuilder.js
  var init_StringifiedNatArbitraryBuilder = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/builders/StringifiedNatArbitraryBuilder.js"() {
      init_Converters();
      init_constantFrom();
      init_nat();
      init_tuple();
      init_NatToStringifiedNat();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/ipV4Extended.js
  var init_ipV4Extended = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/ipV4Extended.js"() {
      init_oneof();
      init_tuple();
      init_StringifiedNatArbitraryBuilder();
      init_Converters();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/CodePointsToString.js
  var init_CodePointsToString = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/CodePointsToString.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/hexaString.js
  var init_hexaString = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/hexaString.js"() {
      init_Converters();
      init_array();
      init_hexa();
      init_StringConstraintsExtractor();
      init_CodePointsToString();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/EntitiesToIPv6.js
  var init_EntitiesToIPv6 = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/EntitiesToIPv6.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/ipV6.js
  var init_ipV6 = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/ipV6.js"() {
      init_array();
      init_Converters();
      init_oneof();
      init_hexaString();
      init_tuple();
      init_ipV4();
      init_EntitiesToIPv6();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/LazyArbitrary.js
  var LazyArbitrary;
  var init_LazyArbitrary = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/LazyArbitrary.js"() {
      init_NextArbitrary();
      LazyArbitrary = class extends NextArbitrary {
        constructor(name) {
          super();
          this.name = name;
          this.underlying = null;
        }
        generate(mrng, biasFactor) {
          if (!this.underlying) {
            throw new Error(`Lazy arbitrary ${JSON.stringify(this.name)} not correctly initialized`);
          }
          return this.underlying.generate(mrng, biasFactor);
        }
        canShrinkWithoutContext(value) {
          if (!this.underlying) {
            throw new Error(`Lazy arbitrary ${JSON.stringify(this.name)} not correctly initialized`);
          }
          return this.underlying.canShrinkWithoutContext(value);
        }
        shrink(value, context2) {
          if (!this.underlying) {
            throw new Error(`Lazy arbitrary ${JSON.stringify(this.name)} not correctly initialized`);
          }
          return this.underlying.shrink(value, context2);
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/letrec.js
  function letrec(builder) {
    const lazyArbs = /* @__PURE__ */ Object.create(null);
    const tie = (key) => {
      if (!Object.prototype.hasOwnProperty.call(lazyArbs, key)) {
        lazyArbs[key] = new LazyArbitrary(String(key));
      }
      return convertFromNext(lazyArbs[key]);
    };
    const strictArbs = builder(tie);
    for (const key in strictArbs) {
      if (!Object.prototype.hasOwnProperty.call(strictArbs, key)) {
        continue;
      }
      const lazyAtKey = lazyArbs[key];
      const lazyArb = lazyAtKey !== void 0 ? lazyAtKey : new LazyArbitrary(key);
      lazyArb.underlying = convertToNext(strictArbs[key]);
      lazyArbs[key] = lazyArb;
    }
    return strictArbs;
  }
  var init_letrec = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/letrec.js"() {
      init_LazyArbitrary();
      init_Converters();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/WordsToLorem.js
  var init_WordsToLorem = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/WordsToLorem.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/lorem.js
  var init_lorem = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/lorem.js"() {
      init_array();
      init_constant();
      init_frequency();
      init_WordsToLorem();
      init_Converters();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/memo.js
  var init_memo = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/memo.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/MixedCaseArbitrary.js
  var init_MixedCaseArbitrary = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/MixedCaseArbitrary.js"() {
      init_Stream();
      init_bigUintN();
      init_NextArbitrary();
      init_Converters();
      init_NextValue();
      init_LazyIterableIterator();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/mixedCase.js
  var init_mixedCase = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/mixedCase.js"() {
      init_Converters();
      init_MixedCaseArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/string.js
  var init_string = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/string.js"() {
      init_Converters();
      init_array();
      init_char();
      init_StringConstraintsExtractor();
      init_CodePointsToString();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/unicodeString.js
  var init_unicodeString = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/unicodeString.js"() {
      init_Converters();
      init_array();
      init_unicode();
      init_StringConstraintsExtractor();
      init_CodePointsToString();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/float32Array.js
  var init_float32Array = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/float32Array.js"() {
      init_FloatingPointArbitrary();
      init_array();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/float64Array.js
  var init_float64Array = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/float64Array.js"() {
      init_FloatingPointArbitrary();
      init_array();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/builders/TypedIntArrayArbitraryBuilder.js
  var init_TypedIntArrayArbitraryBuilder = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/builders/TypedIntArrayArbitraryBuilder.js"() {
      init_array();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/int16Array.js
  var init_int16Array = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/int16Array.js"() {
      init_integer();
      init_TypedIntArrayArbitraryBuilder();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/int32Array.js
  var init_int32Array = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/int32Array.js"() {
      init_integer();
      init_TypedIntArrayArbitraryBuilder();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/int8Array.js
  var init_int8Array = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/int8Array.js"() {
      init_integer();
      init_TypedIntArrayArbitraryBuilder();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/uint16Array.js
  var init_uint16Array = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/uint16Array.js"() {
      init_integer();
      init_TypedIntArrayArbitraryBuilder();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/uint32Array.js
  var init_uint32Array = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/uint32Array.js"() {
      init_integer();
      init_TypedIntArrayArbitraryBuilder();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/uint8Array.js
  var init_uint8Array = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/uint8Array.js"() {
      init_integer();
      init_TypedIntArrayArbitraryBuilder();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/uint8ClampedArray.js
  var init_uint8ClampedArray = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/uint8ClampedArray.js"() {
      init_integer();
      init_TypedIntArrayArbitraryBuilder();
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/SparseArrayArbitrary.js
  var init_SparseArrayArbitrary = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/SparseArrayArbitrary.js"() {
      init_nat();
      init_set();
      init_tuple();
      init_MaxLengthFromMinLength();
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/ObjectArbitrary.js
  var init_ObjectArbitrary = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/ObjectArbitrary.js"() {
      init_stringify();
      init_array();
      init_boolean();
      init_constant();
      init_dictionary();
      init_FloatingPointArbitrary();
      init_frequency();
      init_maxSafeInteger();
      init_memo();
      init_oneof();
      init_set();
      init_string();
      init_unicodeString();
      init_tuple();
      init_bigInt();
      init_date();
      init_float32Array();
      init_float64Array();
      init_int16Array();
      init_int32Array();
      init_int8Array();
      init_uint16Array();
      init_uint32Array();
      init_uint8Array();
      init_uint8ClampedArray();
      init_SparseArrayArbitrary();
      init_KeyValuePairsToObject();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/EnumerableKeysExtractor.js
  var init_EnumerableKeysExtractor = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/EnumerableKeysExtractor.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/ValuesAndSeparateKeysToObject.js
  var init_ValuesAndSeparateKeysToObject = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/ValuesAndSeparateKeysToObject.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/builders/PartialRecordArbitraryBuilder.js
  var noKeyValue;
  var init_PartialRecordArbitraryBuilder = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/builders/PartialRecordArbitraryBuilder.js"() {
      init_Converters();
      init_option();
      init_tuple();
      init_EnumerableKeysExtractor();
      init_ValuesAndSeparateKeysToObject();
      noKeyValue = Symbol("no-key");
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/record.js
  var init_record = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/record.js"() {
      init_PartialRecordArbitraryBuilder();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/StreamArbitrary.js
  var init_StreamArbitrary = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/StreamArbitrary.js"() {
      init_NextArbitrary();
      init_NextValue();
      init_symbols();
      init_Stream();
      init_stringify();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/infiniteStream.js
  var init_infiniteStream = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/infiniteStream.js"() {
      init_Converters();
      init_StreamArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/asciiString.js
  var init_asciiString = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/asciiString.js"() {
      init_Converters();
      init_array();
      init_ascii();
      init_StringConstraintsExtractor();
      init_CodePointsToString();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/StringToBase64.js
  var init_StringToBase64 = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/StringToBase64.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/base64String.js
  var init_base64String = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/base64String.js"() {
      init_Converters();
      init_array();
      init_base64();
      init_MaxLengthFromMinLength();
      init_StringConstraintsExtractor();
      init_CodePointsToString();
      init_StringToBase64();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/fullUnicodeString.js
  var init_fullUnicodeString = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/fullUnicodeString.js"() {
      init_Converters();
      init_array();
      init_fullUnicode();
      init_StringConstraintsExtractor();
      init_CodePointsToString();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/CharsToString.js
  var init_CharsToString = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/CharsToString.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/string16bits.js
  var init_string16bits = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/string16bits.js"() {
      init_Converters();
      init_array();
      init_char16bits();
      init_StringConstraintsExtractor();
      init_CharsToString();
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/BiasedArbitraryWrapper.js
  var init_BiasedArbitraryWrapper = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/definition/BiasedArbitraryWrapper.js"() {
      init_Arbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/SubarrayArbitrary.js
  var init_SubarrayArbitrary = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/SubarrayArbitrary.js"() {
      init_Stream();
      init_Arbitrary();
      init_BiasedArbitraryWrapper();
      init_Shrinkable();
      init_integer();
      init_LazyIterableIterator();
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/UuidArbitrary.js
  var init_UuidArbitrary = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/UuidArbitrary.js"() {
      init_integer();
      init_nat();
      init_tuple();
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/WebArbitrary.js
  var init_WebArbitrary = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/WebArbitrary.js"() {
      init_array();
      init_constantFrom();
      init_constant();
      init_SpecificCharacterRange();
      init_HostArbitrary();
      init_nat();
      init_ipV4();
      init_ipV4Extended();
      init_ipV6();
      init_oneof();
      init_option();
      init_stringOf();
      init_tuple();
    }
  });

  // node_modules/fast-check/lib/esm/check/model/ReplayPath.js
  var init_ReplayPath = __esm({
    "node_modules/fast-check/lib/esm/check/model/ReplayPath.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/check/model/commands/CommandsIterable.js
  var CommandsIterable;
  var init_CommandsIterable = __esm({
    "node_modules/fast-check/lib/esm/check/model/commands/CommandsIterable.js"() {
      init_symbols();
      CommandsIterable = class _CommandsIterable {
        constructor(commands2, metadataForReplay) {
          this.commands = commands2;
          this.metadataForReplay = metadataForReplay;
        }
        [Symbol.iterator]() {
          return this.commands[Symbol.iterator]();
        }
        [cloneMethod]() {
          return new _CommandsIterable(this.commands.map((c) => c.clone()), this.metadataForReplay);
        }
        toString() {
          const serializedCommands = this.commands.filter((c) => c.hasRan).map((c) => c.toString()).join(",");
          const metadata = this.metadataForReplay();
          return metadata.length !== 0 ? `${serializedCommands} /*${metadata}*/` : serializedCommands;
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/check/model/commands/CommandWrapper.js
  var init_CommandWrapper = __esm({
    "node_modules/fast-check/lib/esm/check/model/commands/CommandWrapper.js"() {
      init_stringify();
      init_symbols();
    }
  });

  // node_modules/fast-check/lib/esm/check/model/commands/CommandsArbitrary.js
  var init_CommandsArbitrary = __esm({
    "node_modules/fast-check/lib/esm/check/model/commands/CommandsArbitrary.js"() {
      init_Stream();
      init_Arbitrary();
      init_Shrinkable();
      init_nat();
      init_oneof();
      init_ReplayPath();
      init_CommandsIterable();
      init_CommandWrapper();
      init_LazyIterableIterator();
    }
  });

  // node_modules/fast-check/lib/esm/check/model/commands/ScheduledCommand.js
  var init_ScheduledCommand = __esm({
    "node_modules/fast-check/lib/esm/check/model/commands/ScheduledCommand.js"() {
    }
  });

  // node_modules/fast-check/lib/esm/check/model/ModelRunner.js
  var init_ModelRunner = __esm({
    "node_modules/fast-check/lib/esm/check/model/ModelRunner.js"() {
      init_ScheduledCommand();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/implementations/SchedulerImplem.js
  var SchedulerImplem;
  var init_SchedulerImplem = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/implementations/SchedulerImplem.js"() {
      init_TextEscaper();
      init_symbols();
      init_stringify();
      SchedulerImplem = class _SchedulerImplem {
        constructor(act, taskSelector) {
          this.act = act;
          this.taskSelector = taskSelector;
          this.lastTaskId = 0;
          this.sourceTaskSelector = taskSelector.clone();
          this.scheduledTasks = [];
          this.triggeredTasks = [];
        }
        static buildLog(reportItem) {
          return `[task\${${reportItem.taskId}}] ${reportItem.label.length !== 0 ? `${reportItem.schedulingType}::${reportItem.label}` : reportItem.schedulingType} ${reportItem.status}${reportItem.outputValue !== void 0 ? ` with value ${escapeForTemplateString(reportItem.outputValue)}` : ""}`;
        }
        log(schedulingType, taskId, label, metadata, status, data) {
          this.triggeredTasks.push({
            status,
            schedulingType,
            taskId,
            label,
            metadata,
            outputValue: data !== void 0 ? stringify(data) : void 0
          });
        }
        scheduleInternal(schedulingType, label, task, metadata, thenTaskToBeAwaited) {
          let trigger = null;
          const taskId = ++this.lastTaskId;
          const scheduledPromise = new Promise((resolve, reject) => {
            trigger = () => {
              (thenTaskToBeAwaited ? task.then(() => thenTaskToBeAwaited()) : task).then((data) => {
                this.log(schedulingType, taskId, label, metadata, "resolved", data);
                return resolve(data);
              }, (err) => {
                this.log(schedulingType, taskId, label, metadata, "rejected", err);
                return reject(err);
              });
            };
          });
          this.scheduledTasks.push({
            original: task,
            scheduled: scheduledPromise,
            trigger,
            schedulingType,
            taskId,
            label,
            metadata
          });
          return scheduledPromise;
        }
        schedule(task, label, metadata) {
          return this.scheduleInternal("promise", label || "", task, metadata);
        }
        scheduleFunction(asyncFunction) {
          return (...args) => this.scheduleInternal("function", `${asyncFunction.name}(${args.map(stringify).join(",")})`, asyncFunction(...args), void 0);
        }
        scheduleSequence(sequenceBuilders) {
          const status = { done: false, faulty: false };
          const dummyResolvedPromise = { then: (f) => f() };
          let resolveSequenceTask = () => {
          };
          const sequenceTask = new Promise((resolve) => resolveSequenceTask = resolve);
          sequenceBuilders.reduce((previouslyScheduled, item) => {
            const [builder, label, metadata] = typeof item === "function" ? [item, item.name, void 0] : [item.builder, item.label, item.metadata];
            return previouslyScheduled.then(() => {
              const scheduled = this.scheduleInternal("sequence", label, dummyResolvedPromise, metadata, () => builder());
              scheduled.catch(() => {
                status.faulty = true;
                resolveSequenceTask();
              });
              return scheduled;
            });
          }, dummyResolvedPromise).then(() => {
            status.done = true;
            resolveSequenceTask();
          }, () => {
          });
          return Object.assign(status, {
            task: Promise.resolve(sequenceTask).then(() => {
              return { done: status.done, faulty: status.faulty };
            })
          });
        }
        count() {
          return this.scheduledTasks.length;
        }
        async internalWaitOne() {
          if (this.scheduledTasks.length === 0) {
            throw new Error("No task scheduled");
          }
          const taskIndex = this.taskSelector.nextTaskIndex(this.scheduledTasks);
          const [scheduledTask] = this.scheduledTasks.splice(taskIndex, 1);
          scheduledTask.trigger();
          try {
            await scheduledTask.scheduled;
          } catch (_err) {
          }
        }
        async waitOne() {
          await this.act(async () => await this.internalWaitOne());
        }
        async waitAll() {
          while (this.scheduledTasks.length > 0) {
            await this.waitOne();
          }
        }
        report() {
          return [
            ...this.triggeredTasks,
            ...this.scheduledTasks.map((t2) => ({
              status: "pending",
              schedulingType: t2.schedulingType,
              taskId: t2.taskId,
              label: t2.label,
              metadata: t2.metadata
            }))
          ];
        }
        toString() {
          return "schedulerFor()`\n" + this.report().map(_SchedulerImplem.buildLog).map((log) => `-> ${log}`).join("\n") + "`";
        }
        [cloneMethod]() {
          return new _SchedulerImplem(this.act, this.sourceTaskSelector);
        }
      };
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/BuildSchedulerFor.js
  var init_BuildSchedulerFor = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/BuildSchedulerFor.js"() {
      init_SchedulerImplem();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/SchedulerArbitrary.js
  var init_SchedulerArbitrary = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/_internals/SchedulerArbitrary.js"() {
      init_NextArbitrary();
      init_NextValue();
      init_Stream();
      init_SchedulerImplem();
    }
  });

  // node_modules/fast-check/lib/esm/arbitrary/scheduler.js
  var init_scheduler = __esm({
    "node_modules/fast-check/lib/esm/arbitrary/scheduler.js"() {
      init_Converters();
      init_BuildSchedulerFor();
      init_SchedulerArbitrary();
    }
  });

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/ArbitraryWithShrink.js
  var init_ArbitraryWithShrink = __esm({
    "node_modules/fast-check/lib/esm/check/arbitrary/definition/ArbitraryWithShrink.js"() {
      init_Arbitrary();
      init_Shrinkable();
    }
  });

  // node_modules/fast-check/lib/esm/fast-check-default.js
  var init_fast_check_default = __esm({
    "node_modules/fast-check/lib/esm/fast-check-default.js"() {
      init_Pre();
      init_AsyncProperty();
      init_Property();
      init_Runner();
      init_Sampler();
      init_array();
      init_bigInt();
      init_bigIntN();
      init_bigUint();
      init_bigUintN();
      init_boolean();
      init_falsy();
      init_ascii();
      init_base64();
      init_char();
      init_char16bits();
      init_fullUnicode();
      init_hexa();
      init_unicode();
      init_clonedConstant();
      init_constant();
      init_constantFrom();
      init_context();
      init_date();
      init_clone();
      init_dedup();
      init_Arbitrary();
      init_Shrinkable();
      init_dictionary();
      init_EmailArbitrary();
      init_FloatingPointArbitrary();
      init_frequency();
      init_compareBooleanFunc();
      init_compareFunc();
      init_func();
      init_HostArbitrary();
      init_integer();
      init_maxSafeInteger();
      init_maxSafeNat();
      init_nat();
      init_ipV4();
      init_ipV4Extended();
      init_ipV6();
      init_letrec();
      init_lorem();
      init_mapToConstant();
      init_memo();
      init_mixedCase();
      init_ObjectArbitrary();
      init_oneof();
      init_option();
      init_record();
      init_set();
      init_infiniteStream();
      init_asciiString();
      init_base64String();
      init_fullUnicodeString();
      init_hexaString();
      init_string();
      init_string16bits();
      init_stringOf();
      init_unicodeString();
      init_SubarrayArbitrary();
      init_genericTuple();
      init_tuple();
      init_UuidArbitrary();
      init_WebArbitrary();
      init_CommandsArbitrary();
      init_ModelRunner();
      init_Random();
      init_GlobalParameters();
      init_VerbosityLevel();
      init_ExecutionStatus();
      init_symbols();
      init_Stream();
      init_hash();
      init_stringify();
      init_scheduler();
      init_RunDetailsFormatter();
      init_ArbitraryWithShrink();
      init_ArbitraryWithContextualShrink();
      init_PreconditionFailure();
      init_int8Array();
      init_int16Array();
      init_int32Array();
      init_uint8Array();
      init_uint8ClampedArray();
      init_uint16Array();
      init_uint32Array();
      init_float32Array();
      init_float64Array();
      init_SparseArrayArbitrary();
      init_NextArbitrary();
      init_NextValue();
      init_Converters();
    }
  });

  // node_modules/fast-check/lib/esm/fast-check.js
  var init_fast_check = __esm({
    "node_modules/fast-check/lib/esm/fast-check.js"() {
      init_fast_check_default();
      init_fast_check_default();
    }
  });

  // src/test/exprtests.ts
  var require_exprtests = __commonJS({
    "src/test/exprtests.ts"(exports, module) {
      "use strict";
      var import_tester = __toESM(require_tester());
      init_exprparser();
      init_fast_check();
      init_src();
      (0, import_tester.test)("Test parsing of predefined expressions", async (t) => {
        let testset = [
          "1 + -1",
          "2 + 3 * 3",
          "1 - 1 / 2",
          "(1 - 1) / 2",
          "(1) + (((2)) + 3)"
        ];
        for (let i = 0; i < testset.length; i++) {
          let expr = testset[i];
          let res = eval(expr);
          let calcres = evaluateExpression(expr);
          t.equal(calcres, res, `expression '${expr}' should evaluate to ${res}`);
        }
      });
      (0, import_tester.test)("Test failing expressions", async (t2) => {
        let testset2 = [
          "1 + ",
          "2 ++ 3 * 3",
          "- 1 - 1",
          "",
          "a + 1"
        ];
        for (let i2 = 0; i2 < testset2.length; i2++) {
          let expr3 = testset2[i2];
          t2.throws(
            () => evaluateExpression(expr3),
            ParseError,
            `expression '${expr3}' should not parse`
          );
        }
      });
      var arbNum = integer(-1e3, 1e3).map((n) => n.toString());
      var arbOper = constantFrom("+", "-", "*", "/");
      var arbExpr = letrec((tie) => ({
        num: arbNum,
        oper: tuple(
          tie("expr"),
          arbOper,
          tie("expr")
        ).map((t2) => `${t2[0]} ${t2[1]} ${t2[2]}`),
        par: tie("expr").map((e2) => "(" + e2 + ")"),
        expr: oneof(tie("num"), tie("oper"), tie("par"))
      }));
      (0, import_tester.test)("Test arbitrary expressions", async (t) => assert(
        property(arbExpr.expr, (e) => {
          let res1 = eval(e);
          let res2 = evaluateExpression(e);
          t.equal(res1, res2, `expression '${e}' should evaluate to ${res1}`);
        })
      ));
    }
  });

  // src/components/run-expr-tests.ts
  var import_custom_elem = __toESM(require_custom_elem());
  var import_test_runner = __toESM(require_test_runner());
  init_src();
  init_exprparser();
  var import_exprtests = __toESM(require_exprtests());
  var CalculatorTests = class extends import_custom_elem.StyledElement {
    constructor() {
      super("run-expr-tests");
      this.body.classList.add("calculator");
      this.input = document.createElement("input");
      this.result = document.createElement("div");
      this.result.classList.add("result");
      this.body.append(this.input, this.result);
    }
    connect() {
      this.input.addEventListener("change", (_) => {
        try {
          this.result.innerText = evaluateExpression(this.input.value).toString();
        } catch (e2) {
          if (e2 instanceof ParseError)
            this.result.innerText = e2.message;
          else
            throw e2;
        }
      });
    }
  };
  customElements.define("calculator-tests", CalculatorTests);
})();
//# sourceMappingURL=run-expr-tests.js.map
