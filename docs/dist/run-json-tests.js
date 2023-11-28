"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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
                let test2 = teststack.pop();
                test2.pass = ztest.pass;
                test2.passes = ztest.successCount;
                test2.fails = ztest.failureCount;
                test2.error = ztest.error;
                test2.duration = ztest.executionTime;
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
      var startTestMessage = (test3, offset) => ({
        type: "TEST_START",
        data: test3,
        offset
      });
      var assertionMessage = (assertion, offset) => ({
        type: "ASSERTION",
        data: assertion,
        offset
      });
      var endTestMessage = (test3, offset) => ({
        type: "TEST_END",
        data: test3,
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
          } catch (e) {
            error = e;
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
          var length, i, keys;
          if (Array.isArray(a)) {
            length = a.length;
            if (length != b.length)
              return false;
            for (i = length; i-- !== 0; )
              if (!equal2(a[i], b[i]))
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
          for (i = length; i-- !== 0; )
            if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
              return false;
          for (i = length; i-- !== 0; ) {
            var key = keys[i];
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
        const test3 = (description, spec, opts) => {
          const options = Object.assign({}, defaultTestOptions, opts, { offset: offset + 1, runOnly });
          const subTest = tester(description, spec, options);
          collect(subTest);
          return subTest.routine;
        };
        const skip2 = (description, spec, opts) => {
          return test3(description, spec, Object.assign({}, opts, { skip: true }));
        };
        return {
          ...unbindAssert(Object.create(AssertPrototype, { collect: { value: actualCollect } })),
          test(description, spec, opts = {}) {
            if (runOnly) {
              return skip2(description, spec, opts);
            }
            return test3(description, spec, opts);
          },
          skip(description, spec = noop, opts = {}) {
            return skip2(description, spec, opts);
          },
          only(description, spec, opts = {}) {
            const specFn = runOnly === false ? (_) => {
              throw new Error(`Can not use "only" method when not in run only mode`);
            } : spec;
            return test3(description, specFn, opts);
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
        printComment(comment2, offset = 0) {
          this.print(`# ${comment2}`, offset);
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
        let i = 0;
        return Object.create(Tap, {
          nextId: {
            enumerable: true,
            value: () => {
              return ++i;
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
        let i = 0;
        while (true) {
          yield ++i;
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
            const comment2 = data.skip === true ? "SKIP" : `${data.executionTime}ms`;
            this.print(`${pass ? "ok" : "not ok"} ${id2} - ${description} # ${comment2}`, message.offset);
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
      var test2 = rootTest;
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
      exports.test = test2;
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
        } catch (e) {
          harness.pass = false;
          if (e instanceof Error) {
            console.error(e.name + " exception thrown: " + e.message);
            console.error(e.stack);
          }
        }
        if (harness.pass)
          console.log("Tests PASSED");
        else
          console.log("Tests FAILED");
        process.exit(harness.pass ? 0 : 1);
      }
      function test2(description, spec, options) {
        return harness.test(description, spec, options);
      }
      exports.test = test2;
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
            font-size: 1rem;
        }    
        .test-visualizer {
            overflow: auto;
        }
        .test-runner .summary {
            font-weight: bolder;
        }
        .test-runner .summary .count {
            margin-left: 1rem;
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
          let res = document.createElement(tagName);
          if (cls)
            res.classList.add(cls);
          if (text)
            res.innerText = text;
          return res;
        }
        statusIcon(assertion) {
          return assertion.pass ? "\u2705" : "\u274C";
        }
        testStyle(test2) {
          return test2.pass ? "#f8fff8" : "#fff8f8";
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
          for (let i = 0; i < tests.length; i++)
            lst.appendChild(this.test(tests[i]));
          return lst;
        }
        assertion(assertion) {
          return this.elem("li", void 0, `${this.statusIcon(assertion)} ${assertion.name}`);
        }
        assertions(assertions) {
          let det = this.elem("details");
          det.appendChild(this.elem("summary", void 0, `${assertions.length} assertions`));
          let ol = this.elem("ol");
          for (let i = 0; i < assertions.length; i++)
            ol.appendChild(this.assertion(assertions[i]));
          det.appendChild(ol);
          return det;
        }
        test(test2) {
          if (test2.error)
            return this.bailedOutTest(test2);
          let li = this.elem("li", void 0, `${this.statusIcon(test2)} ${test2.name} in ${test2.duration}ms`);
          if (test2.assertions)
            li.appendChild(this.assertions(test2.assertions));
          if (test2.tests)
            li.appendChild(this.testList(test2.tests));
          return li;
        }
        bailedOutTest(test2) {
          let res = this.elem("li");
          res.innerHTML = `${this.statusIcon(test2)} ${test2.name} threw <b>${test2.error.name}</b> exception:
            <br/><b>${test2.error.message}</b>
            <pre>${test2.error.stack}</pre>`;
          return res;
        }
      };
      exports.TestRunner = TestRunner;
      customElements.define("test-runner", TestRunner);
    }
  });

  // src/components/run-json-tests.ts
  var import_custom_elem = __toESM(require_custom_elem());
  var import_test_runner = __toESM(require_test_runner());

  // src/ref.ts
  var Ref = class {
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

  // src/error.ts
  var ParseError = class extends Error {
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

  // src/result.ts
  function joinExpected(result, other) {
    if (other.expected.length > 0)
      result.expected = result.expected.concat(other.expected);
  }
  function expectedAsCsv(result) {
    return result.expected.map((s) => `"${s}"`).join(", ");
  }
  function succeeded(pos, res) {
    return {
      kind: "ok",
      position: pos,
      result: res
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

  // src/utils.ts
  function initObject(members2) {
    let res = {};
    for (let i = 0; i < members2.length; i++) {
      let [m, v] = members2[i];
      res[m] = v;
    }
    return res;
  }
  function escapeWhitespace(text) {
    return text.replace("\n", "\\n").replace("\r", "\\r").replace("	", "\\t");
  }

  // src/lexer.ts
  var Token = class {
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
  var Lexer = class {
    /**
     * The constructor adds two flags to the regular expressions given as 
     * arguments. The `y` flag makes the search sticky so that it scans the
     * input string from the position indicated by the `lastIndex` property.
     * The `u` flag makes the search support unicode characters.
     */
    constructor(...tokens) {
      this.matchers = tokens.map((t) => ({
        regex: new RegExp(t[0], "yu"),
        token: t[1]
      }));
    }
    /**
     * We check matchers one-by-one in the order they were given to
     * recognize the token in the given position. If none of the matchers
     * succeed, we return `null`.
     */
    matchToken(input, pos) {
      for (let i = 0; i < this.matchers.length; i++) {
        let matcher = this.matchers[i];
        matcher.regex.lastIndex = pos;
        let match = matcher.regex.exec(input);
        if (match != null)
          return new Token(matcher.token, match[0]);
      }
      return null;
    }
  };
  var LexerInput = class {
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
  function lexerInput(text, lexer2, eof2) {
    return new LexerInput(text, lexer2, eof2);
  }

  // src/parser.ts
  var Parser = class _Parser {
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
        let res1 = this.parse(input);
        if (res1.kind == "ok") {
          let res2 = binder(res1.result).parse(input);
          if (res2.kind == "fail" && pos !== input.position)
            input.position = pos;
          return res2;
        }
        return res1;
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
        let res1 = this.parse(input);
        if (res1.kind == "ok")
          return res1;
        if (res1.position > pos)
          return res1;
        let res2 = other.parse(input);
        if (res2.kind == "ok")
          return res2;
        joinExpected(res2, res1);
        return res2;
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
          let res = this.parse(input);
          if (res.kind == "fail")
            return res.position > pos ? res : succeeded(res.position, list);
          list.push(res.result);
        }
      });
    }
    /**
     * Creates a parser that runs `this` parser one or more times.
     */
    oneOrMore() {
      return new _Parser((input) => {
        let res = this.parse(input);
        if (res.kind == "fail")
          return res;
        let list = [res.result];
        while (true) {
          let pos = input.position;
          res = this.parse(input);
          if (res.kind == "fail")
            return res.position > pos ? res : succeeded(res.position, list);
          list.push(res.result);
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
        let res = this.parse(input);
        input.position = pos;
        return res;
      });
    }
    /**
     * Check that `this` parser fails without consuming any input. Corresponds 
     * to the `!` operator in PEG grammars.
     */
    not() {
      return new _Parser((input) => {
        let pos = input.position;
        let res = this.parse(input);
        input.position = pos;
        if (res.kind == "ok") {
          let found = `${res.result}`;
          return failed(res.position, found, ["not " + found]);
        }
        return succeeded(res.position, void 0);
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
        let res = this.parse(input);
        if (res.kind == "fail" && res.position > pos)
          res.position = pos;
        return res;
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
        let res = this.parse(input);
        if (res.kind == "fail")
          res.expected.push(expected);
        return res;
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
        let res = this.parse(input);
        parserDebug.rulesEvaluated++;
        parserDebug.unindent();
        parserDebug.write((res.kind == "ok" ? `${ruleName} SUCCEEDED with value '${escapeWhitespace(`${res.result}`)}'` : `${ruleName} FAILED with value '${escapeWhitespace(`${res.found}`)}'. Expected values: ${expectedAsCsv(res)}`) + ` at position ${res.position}`);
        return res;
      });
    }
  };
  var parserDebug = {
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
  function tryParse(parser, input) {
    parserDebug.rulesEvaluated = 0;
    let res = parser.parse(input);
    if (parserDebug.debugging)
      console.info("Number of rules evaluated: " + parserDebug.rulesEvaluated);
    return res;
  }
  function parse(parser, input) {
    var res = tryParse(parser, input);
    if (res.kind == "fail")
      throw new ParseError(
        "Parsing" /* Parser */,
        res.position,
        res.found,
        res.expected
      );
    return res.result;
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
  function peek() {
    return new Parser((input) => {
      let pos = input.position;
      let next2 = input.next();
      input.position = pos;
      return succeeded(pos, next2);
    });
  }
  function choose(selector) {
    return peek().bind(selector);
  }
  function forwardRef(parser) {
    return new Parser((input) => parser.target.parse(input));
  }
  function token(token2) {
    return satisfy((t) => t.token === token2);
  }
  function terminal(tok, name) {
    return token(tok).expect(name);
  }

  // src/arrayparsers.ts
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

  // src/test/jsonparser.ts
  parserDebug.debugging = false;
  var lexer = new Lexer(
    [/true/, 0 /* True */],
    [/false/, 1 /* False */],
    [/null/, 2 /* Null */],
    [/\{/, 3 /* LeftBrace */],
    [/\}/, 4 /* RightBrace */],
    [/\[/, 5 /* LeftBracket */],
    [/\]/, 6 /* RightBracket */],
    [/,/, 7 /* Comma */],
    [/:/, 8 /* Colon */],
    [/-?(?:[1-9]\d+|\d(?!\d))(?:\.\d+)?(?:[eE][+-]?\d+)?/, 9 /* Number */],
    [
      /"(?:(?:(?!["\\])[\u{0020}-\u{ffff}])|(?:\\(?:["\\\/bnfrt]|(?:u[0-9a-fA-F]{4}))))*"/u,
      10 /* String */
    ],
    [/[\t\n\r ]+/, 11 /* Whitespace */],
    [/\/\/[^\n\r]*/, 12 /* Comment */]
  );
  var comment = token(12 /* Comment */);
  var whitespace = token(11 /* Whitespace */).or(comment).zeroOrMore();
  var number = terminal(9 /* Number */, "<number>").map((t) => Number(t.text)).followedBy(whitespace);
  var string = terminal(10 /* String */, "<string>").map((t) => JSON.parse(t.text)).followedBy(whitespace);
  var littrue = terminal(0 /* True */, "true").map((t) => true).followedBy(whitespace);
  var litfalse = terminal(1 /* False */, "false").map((t) => false).followedBy(whitespace);
  var litnull = terminal(2 /* Null */, "null").map((t) => null).followedBy(whitespace);
  var comma = terminal(7 /* Comma */, ",").followedBy(whitespace);
  var colon = terminal(8 /* Colon */, ":").followedBy(whitespace);
  var beginarray = terminal(5 /* LeftBracket */, "[").followedBy(whitespace);
  var endarray = terminal(6 /* RightBracket */, "]").followedBy(whitespace);
  var beginobject = terminal(3 /* LeftBrace */, "{").followedBy(whitespace);
  var endobject = terminal(4 /* RightBrace */, "}").followedBy(whitespace);
  var eof = terminal(13 /* EOF */, "<end of input>");
  var element = new Ref();
  var elements = forwardRef(element).zeroOrMoreSeparatedBy(comma).trace("elements");
  var array = elements.bracketedBy(beginarray, endarray).trace("array");
  var member = string.bind(
    (s) => colon.bind(
      (c) => forwardRef(element).bind(
        (e) => mret([s, e])
      )
    )
  ).trace("member");
  var members = member.zeroOrMoreSeparatedBy(comma).trace("members");
  var object = members.bracketedBy(beginobject, endobject).map((ms) => initObject(ms)).trace("object");
  element.target = choose(
    (token2) => {
      switch (token2.token) {
        case 3 /* LeftBrace */:
          return object;
        case 5 /* LeftBracket */:
          return array;
        case 10 /* String */:
          return string;
        case 9 /* Number */:
          return number;
        case 0 /* True */:
          return littrue;
        case 1 /* False */:
          return litfalse;
        case 2 /* Null */:
          return litnull;
        default:
          return fail(
            token2.text,
            "{",
            "[",
            "<string>",
            "<number>",
            "true",
            "false",
            "null"
          );
      }
    }
  ).trace("element");
  var json = whitespace.seq(element.target).followedBy(eof).trace("json");
  function jsonInput(text) {
    return lexerInput(
      text,
      lexer,
      new Token(13 /* EOF */, "<end of input>")
    );
  }
  function parseJson(text) {
    return parse(json, jsonInput(text));
  }

  // src/test/jsontests.ts
  var import_tester = __toESM(require_tester());

  // node_modules/fast-check/lib/esm/check/precondition/PreconditionFailure.js
  var PreconditionFailure = class _PreconditionFailure extends Error {
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

  // node_modules/fast-check/lib/esm/stream/StreamHelpers.js
  var Nil = class {
    [Symbol.iterator]() {
      return this;
    }
    next(value) {
      return { value, done: true };
    }
  };
  Nil.nil = new Nil();
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
    for (let i = 0; i < n; ++i) {
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

  // node_modules/fast-check/lib/esm/stream/Stream.js
  var Stream = class _Stream {
    constructor(g) {
      this.g = g;
    }
    static nil() {
      return new _Stream(nilHelper());
    }
    static of(...elements2) {
      return new _Stream(elements2[Symbol.iterator]());
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
  function stream(g) {
    return new Stream(g);
  }

  // node_modules/fast-check/lib/esm/check/symbols.js
  var cloneMethod = Symbol("fast-check/cloneMethod");
  function hasCloneMethod(instance) {
    return instance !== null && (typeof instance === "object" || typeof instance === "function") && cloneMethod in instance && typeof instance[cloneMethod] === "function";
  }
  function cloneIfNeeded(instance) {
    return hasCloneMethod(instance) ? instance[cloneMethod]() : instance;
  }

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/Shrinkable.js
  var Shrinkable = class _Shrinkable {
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

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/Arbitrary.js
  var Arbitrary = class {
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
  var ChainArbitrary = class _ChainArbitrary extends Arbitrary {
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
      return this.arb.withBias(freq).chain((t) => this.fmapper(t).withBias(freq));
    }
    static shrinkChain(mrng, src, dst, fmapper) {
      return new Shrinkable(dst.value, () => src.shrink().map((v) => _ChainArbitrary.shrinkChain(mrng.clone(), v, fmapper(v.value).generate(mrng.clone()), fmapper)).join(dst.shrink()));
    }
  };
  var MapArbitrary = class extends Arbitrary {
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
  var FilterArbitrary = class extends Arbitrary {
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
  var NoShrinkArbitrary = class extends Arbitrary {
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
  var NoBiasArbitrary = class extends Arbitrary {
    constructor(arb) {
      super();
      this.arb = arb;
    }
    generate(mrng) {
      return this.arb.generate(mrng);
    }
  };
  function assertIsArbitrary(instance) {
    if (typeof instance !== "object" || instance === null || !("generate" in instance)) {
      throw new Error("Unexpected value received: not an instance of Arbitrary");
    }
  }

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/ArbitraryWithContextualShrink.js
  function removeContextFromContextualValue(contextualValue) {
    return contextualValue[0];
  }
  var ArbitraryWithContextualShrink = class extends Arbitrary {
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

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/NextValue.js
  var NextValue = class {
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

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/NextArbitrary.js
  var NextArbitrary = class {
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
  var ChainArbitrary2 = class extends NextArbitrary {
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
  var MapArbitrary2 = class extends NextArbitrary {
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
  var FilterArbitrary2 = class extends NextArbitrary {
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
  var NoShrinkArbitrary2 = class extends NextArbitrary {
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
  var NoBiasArbitrary2 = class extends NextArbitrary {
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
  function assertIsNextArbitrary(instance) {
    if (typeof instance !== "object" || instance === null || !("generate" in instance) || !("shrink" in instance) || "shrinkableFor" in instance) {
      throw new Error("Unexpected value received: not an instance of NextArbitrary");
    }
  }

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/ConverterToNext.js
  var _a;
  var identifier = "__ConverterToNext__";
  function fromShrinkableToNextValue(g) {
    if (!g.hasToBeCloned) {
      return new NextValue(g.value_, g);
    }
    return new NextValue(g.value_, g, () => g.value);
  }
  var ConverterToNext = class _ConverterToNext extends NextArbitrary {
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
      return _ConverterToNext.convertIfNeeded(this.arb.chain((t) => {
        const fmapped = fmapper(t);
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

  // node_modules/fast-check/lib/esm/check/arbitrary/definition/ConverterFromNext.js
  var _a2;
  var identifier2 = "__ConverterFromNext__";
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
  var ConverterFromNext = class _ConverterFromNext extends ArbitraryWithContextualShrink {
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
      return _ConverterFromNext.convertIfNeeded(this.arb.chain((t) => {
        const fmapped = fmapper(t);
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

  // node_modules/fast-check/lib/esm/arbitrary/_internals/TupleArbitrary.js
  var TupleArbitrary = class _TupleArbitrary extends NextArbitrary {
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

  // node_modules/fast-check/lib/esm/arbitrary/genericTuple.js
  function genericTuple(arbs) {
    const nextArbs = arbs.map((arb) => convertToNext(arb));
    return convertFromNext(new TupleArbitrary(nextArbs));
  }

  // node_modules/fast-check/lib/esm/check/property/IRawProperty.js
  var runIdToFrequency = (runId) => 2 + Math.floor(Math.log(runId + 1) / Math.log(10));

  // node_modules/fast-check/lib/esm/check/runner/configuration/GlobalParameters.js
  var globalParameters = {};
  function readConfigureGlobal() {
    return globalParameters;
  }

  // node_modules/fast-check/lib/esm/check/property/AsyncProperty.generic.js
  var AsyncProperty = class _AsyncProperty {
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

  // node_modules/fast-check/lib/esm/check/property/Property.generic.js
  var Property = class _Property {
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

  // node_modules/fast-check/lib/esm/check/property/Property.generated.js
  function property(...args) {
    if (args.length < 2)
      throw new Error("property expects at least two parameters");
    const arbs = args.slice(0, args.length - 1);
    const p = args[args.length - 1];
    return new Property(genericTuple(arbs), (t) => p(...t));
  }

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

  // node_modules/pure-rand/lib/esm/generator/LinearCongruential.js
  var MULTIPLIER = 214013;
  var INCREMENT = 2531011;
  var MASK = 4294967295;
  var MASK_2 = (1 << 31) - 1;
  var computeNextSeed = function(seed) {
    return seed * MULTIPLIER + INCREMENT & MASK;
  };
  var computeValueFromNextSeed = function(nextseed) {
    return (nextseed & MASK_2) >> 16;
  };
  var LinearCongruential = function() {
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
  var LinearCongruential32 = function() {
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
  var congruential = function(seed) {
    return new LinearCongruential(seed);
  };
  var congruential32 = function(seed) {
    return new LinearCongruential32(seed);
  };

  // node_modules/pure-rand/lib/esm/generator/MersenneTwister.js
  var MersenneTwister = function() {
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
  function MersenneTwister_default(seed) {
    return MersenneTwister.from(seed);
  }

  // node_modules/pure-rand/lib/esm/generator/XorShift.js
  var XorShift128Plus = function() {
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
      for (var i = 0; i !== 4; ++i) {
        for (var mask = 1; mask; mask <<= 1) {
          if (jump[i] & mask) {
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
  var xorshift128plus = function(seed) {
    return new XorShift128Plus(-1, ~seed, seed | 0, 0);
  };

  // node_modules/pure-rand/lib/esm/generator/XoroShiro.js
  var XoroShiro128Plus = function() {
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
      for (var i = 0; i !== 4; ++i) {
        for (var mask = 1; mask; mask <<= 1) {
          if (jump[i] & mask) {
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
  var xoroshiro128plus = function(seed) {
    return new XoroShiro128Plus(-1, ~seed, seed | 0, 0);
  };

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

  // node_modules/pure-rand/lib/esm/distribution/UnsafeUniformArrayIntDistribution.js
  function unsafeUniformArrayIntDistribution(from, to, rng) {
    var rangeSize = trimArrayIntInplace(addOneToPositiveArrayInt(substractArrayIntToNew(to, from)));
    var emptyArrayIntData = rangeSize.data.slice(0);
    var g = unsafeUniformArrayIntDistributionInternal(emptyArrayIntData, rangeSize.data, rng);
    return trimArrayIntInplace(addArrayIntToNew({ sign: 1, data: g }, from));
  }

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

  // node_modules/pure-rand/lib/esm/distribution/UnsafeUniformIntDistribution.js
  var sharedA = { sign: 1, data: [0, 0] };
  var sharedB = { sign: 1, data: [0, 0] };
  var sharedC = { sign: 1, data: [0, 0] };
  var sharedData = [0, 0];
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

  // node_modules/pure-rand/lib/esm/pure-rand-default.js
  var __type = "module";
  var __version = "5.0.0";
  var __commitHash = "744555855a01e1551ab1cf67a6ea973d14964661";

  // node_modules/pure-rand/lib/esm/pure-rand.js
  var pure_rand_default = pure_rand_default_exports;

  // node_modules/fast-check/lib/esm/check/runner/configuration/VerbosityLevel.js
  var VerbosityLevel;
  (function(VerbosityLevel2) {
    VerbosityLevel2[VerbosityLevel2["None"] = 0] = "None";
    VerbosityLevel2[VerbosityLevel2["Verbose"] = 1] = "Verbose";
    VerbosityLevel2[VerbosityLevel2["VeryVerbose"] = 2] = "VeryVerbose";
  })(VerbosityLevel || (VerbosityLevel = {}));

  // node_modules/fast-check/lib/esm/check/runner/configuration/QualifiedParameters.js
  var QualifiedParameters = class _QualifiedParameters {
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

  // node_modules/fast-check/lib/esm/check/property/SkipAfterProperty.js
  var SkipAfterProperty = class {
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

  // node_modules/fast-check/lib/esm/check/property/TimeoutProperty.js
  var timeoutAfter = (timeMs) => {
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
  var TimeoutProperty = class {
    constructor(property2, timeMs) {
      this.property = property2;
      this.timeMs = timeMs;
      this.isAsync = () => true;
    }
    generate(mrng, runId) {
      return this.property.generate(mrng, runId);
    }
    async run(v) {
      const t = timeoutAfter(this.timeMs);
      const propRun = Promise.race([this.property.run(v), t.promise]);
      propRun.then(t.clear, t.clear);
      return propRun;
    }
  };

  // node_modules/fast-check/lib/esm/check/property/UnbiasedProperty.js
  var UnbiasedProperty = class {
    constructor(property2) {
      this.property = property2;
      this.isAsync = () => this.property.isAsync();
      this.generate = (mrng, _runId) => this.property.generate(mrng);
      this.run = (v) => this.property.run(v);
    }
  };

  // node_modules/fast-check/lib/esm/utils/stringify.js
  var toStringMethod = Symbol("fast-check/toStringMethod");
  function hasToStringMethod(instance) {
    return instance !== null && (typeof instance === "object" || typeof instance === "function") && toStringMethod in instance && typeof instance[toStringMethod] === "function";
  }
  var asyncToStringMethod = Symbol("fast-check/asyncToStringMethod");
  function hasAsyncToStringMethod(instance) {
    return instance !== null && (typeof instance === "object" || typeof instance === "function") && asyncToStringMethod in instance && typeof instance[asyncToStringMethod] === "function";
  }
  var findSymbolNameRegex = /^Symbol\((.*)\)$/;
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
  var IgnoreEqualValuesProperty = class {
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

  // node_modules/fast-check/lib/esm/check/runner/reporter/ExecutionStatus.js
  var ExecutionStatus;
  (function(ExecutionStatus2) {
    ExecutionStatus2[ExecutionStatus2["Success"] = 0] = "Success";
    ExecutionStatus2[ExecutionStatus2["Skipped"] = -1] = "Skipped";
    ExecutionStatus2[ExecutionStatus2["Failure"] = 1] = "Failure";
  })(ExecutionStatus || (ExecutionStatus = {}));

  // node_modules/fast-check/lib/esm/check/runner/reporter/RunExecution.js
  var RunExecution = class _RunExecution {
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

  // node_modules/fast-check/lib/esm/check/runner/RunnerIterator.js
  var RunnerIterator = class {
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

  // node_modules/fast-check/lib/esm/check/runner/SourceValuesIterator.js
  var SourceValuesIterator = class {
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

  // node_modules/fast-check/lib/esm/random/generator/PureRandom.js
  var ConvertedRandomGenerator = class _ConvertedRandomGenerator {
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
  function convertToRandomGenerator(rng) {
    if ("clone" in rng && "unsafeNext" in rng) {
      return rng;
    }
    return new ConvertedRandomGenerator(rng);
  }

  // node_modules/fast-check/lib/esm/random/generator/Random.js
  var Random = class _Random {
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

  // node_modules/fast-check/lib/esm/check/runner/Tosser.js
  function lazyGenerate(generator, rng, idx) {
    return () => generator.generate(new Random(rng), idx);
  }
  function* toss(generator, seed, random, examples) {
    yield* examples.map((e) => () => new Shrinkable(e));
    let idx = 0;
    let rng = convertToRandomGenerator(random(seed));
    for (; ; ) {
      rng = rng.jump ? rng.jump() : skipN(rng, 42);
      yield lazyGenerate(generator, rng, idx++);
    }
  }

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
    return property2.isAsync() ? asyncRunIt(property2, sourceValues, qParams.verbose, qParams.markInterruptAsFailure).then((e) => e.toRunDetails(qParams.seed, qParams.path, maxSkips, qParams)) : runIt(property2, sourceValues, qParams.verbose, qParams.markInterruptAsFailure).toRunDetails(qParams.seed, qParams.path, maxSkips, qParams);
  }
  function assert(property2, params) {
    const out = check(property2, params);
    if (property2.isAsync())
      return out.then(asyncReportRunDetails);
    else
      reportRunDetails(out);
  }

  // node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/BiasNumericRange.js
  function integerLogLike(v) {
    return Math.floor(Math.log(v) / Math.log(2));
  }
  function bigIntLogLike(v) {
    if (v === BigInt(0))
      return BigInt(0);
    return BigInt(v.toString().length);
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
        const next2 = toremove === realGap ? target : current - toremove;
        yield new NextValue(next2, previous);
        previous = next2;
      }
    }
    function* shrinkIncr() {
      let previous = tryTargetAsap ? void 0 : target;
      const gap = tryTargetAsap ? realGap : halveNegInteger(realGap);
      for (let toremove = gap; toremove < 0; toremove = halveNegInteger(toremove)) {
        const next2 = toremove === realGap ? target : current - toremove;
        yield new NextValue(next2, previous);
        previous = next2;
      }
    }
    return realGap > 0 ? stream(shrinkDecr()) : stream(shrinkIncr());
  }

  // node_modules/fast-check/lib/esm/arbitrary/_internals/IntegerArbitrary.js
  var IntegerArbitrary = class _IntegerArbitrary extends NextArbitrary {
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

  // node_modules/fast-check/lib/esm/stream/LazyIterableIterator.js
  var LazyIterableIterator = class {
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
  function makeLazy(producer) {
    return new LazyIterableIterator(producer);
  }

  // node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/BuildCompareFilter.js
  function subArrayContains(tab, upperBound, includeValue) {
    for (let idx = 0; idx < upperBound; ++idx) {
      if (includeValue(tab[idx]))
        return true;
    }
    return false;
  }
  function swap(tab, idx1, idx2) {
    const temp = tab[idx1];
    tab[idx1] = tab[idx2];
    tab[idx2] = temp;
  }
  function buildCompareFilter(compare) {
    return (tab) => {
      let finalLength = tab.length;
      for (let idx = tab.length - 1; idx !== -1; --idx) {
        if (subArrayContains(tab, idx, (t) => compare(t.value_, tab[idx].value_))) {
          --finalLength;
          swap(tab, idx, finalLength);
        }
      }
      return tab.slice(0, finalLength);
    };
  }

  // node_modules/fast-check/lib/esm/arbitrary/_internals/ArrayArbitrary.js
  var ArrayArbitrary = class _ArrayArbitrary extends NextArbitrary {
    constructor(arb, minLength, maxLength, isEqual) {
      super();
      this.arb = arb;
      this.minLength = minLength;
      this.maxLength = maxLength;
      this.isEqual = isEqual;
      this.lengthArb = convertToNext(integer(minLength, maxLength));
      this.preFilter = this.isEqual !== void 0 ? buildCompareFilter(this.isEqual) : (tab) => tab;
    }
    static makeItCloneable(vs, shrinkables) {
      vs[cloneMethod] = () => {
        const cloned = [];
        for (let idx = 0; idx !== shrinkables.length; ++idx) {
          cloned.push(shrinkables[idx].value);
        }
        this.makeItCloneable(cloned, shrinkables);
        return cloned;
      };
      return vs;
    }
    static canAppendItem(items, newItem, isEqual) {
      for (let idx = 0; idx !== items.length; ++idx) {
        if (isEqual(items[idx].value_, newItem.value_)) {
          return false;
        }
      }
      return true;
    }
    generateNItemsNoDuplicates(N, mrng, biasFactorItems) {
      let numSkippedInRow = 0;
      const items = [];
      while (items.length < N && numSkippedInRow < this.maxLength) {
        const current = this.arb.generate(mrng, biasFactorItems);
        if (this.isEqual === void 0 || _ArrayArbitrary.canAppendItem(items, current, this.isEqual)) {
          numSkippedInRow = 0;
          items.push(current);
        } else {
          numSkippedInRow += 1;
        }
      }
      return items;
    }
    generateNItems(N, mrng, biasFactorItems) {
      const items = [];
      for (let index = 0; index !== N; ++index) {
        const current = this.arb.generate(mrng, biasFactorItems);
        items.push(current);
      }
      return items;
    }
    wrapper(itemsRaw, shrunkOnce, itemsRawLengthContext) {
      const items = shrunkOnce ? this.preFilter(itemsRaw) : itemsRaw;
      let cloneable = false;
      const vs = [];
      const itemsContexts = [];
      for (let idx = 0; idx !== items.length; ++idx) {
        const s = items[idx];
        cloneable = cloneable || s.hasToBeCloned;
        vs.push(s.value);
        itemsContexts.push(s.context);
      }
      if (cloneable) {
        _ArrayArbitrary.makeItCloneable(vs, items);
      }
      const context2 = {
        shrunkOnce,
        lengthContext: itemsRaw.length === items.length && itemsRawLengthContext !== void 0 ? itemsRawLengthContext : void 0,
        itemsContexts
      };
      return new NextValue(vs, context2);
    }
    generate(mrng, biasFactor) {
      const biasMeta = this.applyBias(mrng, biasFactor);
      const targetSize = biasMeta.size;
      const items = this.isEqual !== void 0 ? this.generateNItemsNoDuplicates(targetSize, mrng, biasMeta.biasFactorItems) : this.generateNItems(targetSize, mrng, biasMeta.biasFactorItems);
      return this.wrapper(items, false, void 0);
    }
    applyBias(mrng, biasFactor) {
      if (biasFactor === void 0 || mrng.nextInt(1, biasFactor) !== 1) {
        return { size: this.lengthArb.generate(mrng, void 0).value };
      }
      if (mrng.nextInt(1, biasFactor) !== 1 || this.minLength === this.maxLength) {
        return { size: this.lengthArb.generate(mrng, void 0).value, biasFactorItems: biasFactor };
      }
      const maxBiasedLength = this.minLength + Math.floor(Math.log(this.maxLength - this.minLength) / Math.log(2));
      const targetSizeValue = convertToNext(integer(this.minLength, maxBiasedLength)).generate(mrng, void 0);
      return { size: targetSizeValue.value, biasFactorItems: biasFactor };
    }
    canShrinkWithoutContext(value) {
      if (!Array.isArray(value) || this.minLength > value.length || value.length > this.maxLength) {
        return false;
      }
      for (let index = 0; index !== value.length; ++index) {
        if (!(index in value)) {
          return false;
        }
        if (!this.arb.canShrinkWithoutContext(value[index])) {
          return false;
        }
      }
      const filtered = this.preFilter(value.map((item) => new NextValue(item, void 0)));
      return filtered.length === value.length;
    }
    shrinkImpl(value, context2) {
      if (value.length === 0) {
        return Stream.nil();
      }
      const safeContext = context2 !== void 0 ? context2 : { shrunkOnce: false, lengthContext: void 0, itemsContexts: [] };
      return this.lengthArb.shrink(value.length, safeContext.lengthContext).drop(safeContext.shrunkOnce && safeContext.lengthContext === void 0 && value.length > this.minLength + 1 ? 1 : 0).map((lengthValue) => {
        const sliceStart = value.length - lengthValue.value;
        return [
          value.slice(sliceStart).map((v, index) => new NextValue(cloneIfNeeded(v), safeContext.itemsContexts[index + sliceStart])),
          lengthValue.context
        ];
      }).join(this.arb.shrink(value[0], safeContext.itemsContexts[0]).map((v) => {
        return [
          [v].concat(value.slice(1).map((v2, index) => new NextValue(cloneIfNeeded(v2), safeContext.itemsContexts[index + 1]))),
          void 0
        ];
      })).join(value.length > this.minLength ? makeLazy(() => this.shrinkImpl(value.slice(1), {
        shrunkOnce: false,
        lengthContext: void 0,
        itemsContexts: safeContext.itemsContexts.slice(1)
      }).filter((v) => this.minLength <= v[0].length + 1).map((v) => {
        return [
          [new NextValue(cloneIfNeeded(value[0]), safeContext.itemsContexts[0])].concat(v[0]),
          void 0
        ];
      })) : Stream.nil());
    }
    shrink(value, context2) {
      return this.shrinkImpl(value, context2).map((contextualValue) => this.wrapper(contextualValue[0], true, contextualValue[1]));
    }
  };

  // node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/MaxLengthFromMinLength.js
  function maxLengthFromMinLength(minLength) {
    return 2 * minLength + 10;
  }

  // node_modules/fast-check/lib/esm/arbitrary/array.js
  function array2(arb, ...args) {
    const nextArb = convertToNext(arb);
    if (args[0] === void 0)
      return convertFromNext(new ArrayArbitrary(nextArb, 0, maxLengthFromMinLength(0)));
    if (typeof args[0] === "object") {
      const minLength = args[0].minLength || 0;
      const specifiedMaxLength = args[0].maxLength;
      const maxLength = specifiedMaxLength !== void 0 ? specifiedMaxLength : maxLengthFromMinLength(minLength);
      return convertFromNext(new ArrayArbitrary(nextArb, minLength, maxLength));
    }
    if (args[1] !== void 0)
      return convertFromNext(new ArrayArbitrary(nextArb, args[0], args[1]));
    return convertFromNext(new ArrayArbitrary(nextArb, 0, args[0]));
  }

  // node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/ShrinkBigInt.js
  function halveBigInt(n) {
    return n / BigInt(2);
  }
  function shrinkBigInt(current, target, tryTargetAsap) {
    const realGap = current - target;
    function* shrinkDecr() {
      let previous = tryTargetAsap ? void 0 : target;
      const gap = tryTargetAsap ? realGap : halveBigInt(realGap);
      for (let toremove = gap; toremove > 0; toremove = halveBigInt(toremove)) {
        const next2 = current - toremove;
        yield new NextValue(next2, previous);
        previous = next2;
      }
    }
    function* shrinkIncr() {
      let previous = tryTargetAsap ? void 0 : target;
      const gap = tryTargetAsap ? realGap : halveBigInt(realGap);
      for (let toremove = gap; toremove < 0; toremove = halveBigInt(toremove)) {
        const next2 = current - toremove;
        yield new NextValue(next2, previous);
        previous = next2;
      }
    }
    return realGap > 0 ? stream(shrinkDecr()) : stream(shrinkIncr());
  }

  // node_modules/fast-check/lib/esm/arbitrary/_internals/BigIntArbitrary.js
  var BigIntArbitrary = class _BigIntArbitrary extends NextArbitrary {
    constructor(min, max) {
      super();
      this.min = min;
      this.max = max;
    }
    generate(mrng, biasFactor) {
      const range = this.computeGenerateRange(mrng, biasFactor);
      return new NextValue(mrng.nextBigInt(range.min, range.max), void 0);
    }
    computeGenerateRange(mrng, biasFactor) {
      if (biasFactor === void 0 || mrng.nextInt(1, biasFactor) !== 1) {
        return { min: this.min, max: this.max };
      }
      const ranges = biasNumericRange(this.min, this.max, bigIntLogLike);
      if (ranges.length === 1) {
        return ranges[0];
      }
      const id = mrng.nextInt(-2 * (ranges.length - 1), ranges.length - 2);
      return id < 0 ? ranges[0] : ranges[id + 1];
    }
    canShrinkWithoutContext(value) {
      return typeof value === "bigint" && this.min <= value && value <= this.max;
    }
    shrink(current, context2) {
      if (!_BigIntArbitrary.isValidContext(current, context2)) {
        const target = this.defaultTarget();
        return shrinkBigInt(current, target, true);
      }
      if (this.isLastChanceTry(current, context2)) {
        return Stream.of(new NextValue(context2, void 0));
      }
      return shrinkBigInt(current, context2, false);
    }
    defaultTarget() {
      if (this.min <= 0 && this.max >= 0) {
        return BigInt(0);
      }
      return this.min < 0 ? this.max : this.min;
    }
    isLastChanceTry(current, context2) {
      if (current > 0)
        return current === context2 + BigInt(1) && current > this.min;
      if (current < 0)
        return current === context2 - BigInt(1) && current < this.max;
      return false;
    }
    static isValidContext(current, context2) {
      if (context2 === void 0) {
        return false;
      }
      if (typeof context2 !== "bigint") {
        throw new Error(`Invalid context type passed to BigIntArbitrary (#1)`);
      }
      const differentSigns = current > 0 && context2 < 0 || current < 0 && context2 > 0;
      if (context2 !== BigInt(0) && differentSigns) {
        throw new Error(`Invalid context value passed to BigIntArbitrary (#2)`);
      }
      return true;
    }
  };

  // node_modules/fast-check/lib/esm/arbitrary/bigInt.js
  function buildCompleteBigIntConstraints(constraints) {
    const DefaultPow = 256;
    const DefaultMin = BigInt(-1) << BigInt(DefaultPow - 1);
    const DefaultMax = (BigInt(1) << BigInt(DefaultPow - 1)) - BigInt(1);
    const min = constraints.min;
    const max = constraints.max;
    return {
      min: min !== void 0 ? min : DefaultMin - (max !== void 0 && max < BigInt(0) ? max * max : BigInt(0)),
      max: max !== void 0 ? max : DefaultMax + (min !== void 0 && min > BigInt(0) ? min * min : BigInt(0))
    };
  }
  function extractBigIntConstraints(args) {
    if (args[0] === void 0) {
      return {};
    }
    if (args[1] === void 0) {
      const constraints = args[0];
      return constraints;
    }
    return { min: args[0], max: args[1] };
  }
  function bigInt(...args) {
    const constraints = buildCompleteBigIntConstraints(extractBigIntConstraints(args));
    if (constraints.min > constraints.max) {
      throw new Error("fc.bigInt expects max to be greater than or equal to min");
    }
    const arb = new BigIntArbitrary(constraints.min, constraints.max);
    return convertFromNextWithShrunkOnce(arb, arb.defaultTarget());
  }

  // node_modules/fast-check/lib/esm/arbitrary/boolean.js
  function booleanMapper(v) {
    return v === 1;
  }
  function booleanUnmapper(v) {
    if (typeof v !== "boolean")
      throw new Error("Unsupported input type");
    return v === true ? 1 : 0;
  }
  function boolean() {
    return convertFromNext(convertToNext(integer({ min: 0, max: 1 })).map(booleanMapper, booleanUnmapper).noBias());
  }

  // node_modules/fast-check/lib/esm/arbitrary/_internals/ConstantArbitrary.js
  var ConstantArbitrary = class extends NextArbitrary {
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

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/IndexToCharString.js
  var indexToCharStringMapper = String.fromCodePoint;
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

  // node_modules/fast-check/lib/esm/arbitrary/_internals/builders/CharacterArbitraryBuilder.js
  function buildCharacterArbitrary(min, max, mapToCode, unmapFromCode) {
    return convertFromNext(convertToNext(integer(min, max)).map((n) => indexToCharStringMapper(mapToCode(n)), (c) => unmapFromCode(indexToCharStringUnmapper(c))));
  }

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

  // node_modules/fast-check/lib/esm/arbitrary/char.js
  function identity(v) {
    return v;
  }
  function char() {
    return buildCharacterArbitrary(32, 126, identity, identity);
  }

  // node_modules/fast-check/lib/esm/arbitrary/fullUnicode.js
  var gapSize = 57343 + 1 - 55296;
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

  // node_modules/fast-check/lib/esm/arbitrary/unicode.js
  var gapSize2 = 57343 + 1 - 55296;

  // node_modules/fast-check/lib/esm/arbitrary/constant.js
  function constant(value) {
    return convertFromNext(new ConstantArbitrary([value]));
  }

  // node_modules/fast-check/lib/esm/arbitrary/context.js
  var ContextImplem = class _ContextImplem {
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

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/TimeToDate.js
  function timeToDateMapper(time) {
    return new Date(time);
  }
  function timeToDateUnmapper(value) {
    if (!(value instanceof Date) || value.constructor !== Date) {
      throw new Error("Not a valid value for date unmapper");
    }
    return value.getTime();
  }

  // node_modules/fast-check/lib/esm/arbitrary/date.js
  function date(constraints) {
    const intMin = constraints && constraints.min !== void 0 ? constraints.min.getTime() : -864e13;
    const intMax = constraints && constraints.max !== void 0 ? constraints.max.getTime() : 864e13;
    if (Number.isNaN(intMin))
      throw new Error("fc.date min must be valid instance of Date");
    if (Number.isNaN(intMax))
      throw new Error("fc.date max must be valid instance of Date");
    if (intMin > intMax)
      throw new Error("fc.date max must be greater or equal to min");
    return convertFromNext(convertToNext(integer(intMin, intMax)).map(timeToDateMapper, timeToDateUnmapper));
  }

  // node_modules/fast-check/lib/esm/arbitrary/set.js
  function buildCompleteSetConstraints(constraints) {
    const minLength = constraints.minLength !== void 0 ? constraints.minLength : 0;
    const maxLength = constraints.maxLength !== void 0 ? constraints.maxLength : maxLengthFromMinLength(minLength);
    const compare = constraints.compare !== void 0 ? constraints.compare : (a, b) => a === b;
    return { minLength, maxLength, compare };
  }
  function extractSetConstraints(args) {
    if (args[0] === void 0) {
      return {};
    }
    if (args[1] === void 0) {
      const sargs2 = args;
      if (typeof sargs2[0] === "number")
        return { maxLength: sargs2[0] };
      if (typeof sargs2[0] === "function")
        return { compare: sargs2[0] };
      return sargs2[0];
    }
    if (args[2] === void 0) {
      const sargs2 = args;
      if (typeof sargs2[1] === "number")
        return { minLength: sargs2[0], maxLength: sargs2[1] };
      return { maxLength: sargs2[0], compare: sargs2[1] };
    }
    const sargs = args;
    return { minLength: sargs[0], maxLength: sargs[1], compare: sargs[2] };
  }
  function set(arb, ...args) {
    const constraints = buildCompleteSetConstraints(extractSetConstraints(args));
    const minLength = constraints.minLength;
    const maxLength = constraints.maxLength;
    const compare = constraints.compare;
    const nextArb = convertToNext(arb);
    const arrayArb = convertFromNext(new ArrayArbitrary(nextArb, minLength, maxLength, compare));
    if (minLength === 0)
      return arrayArb;
    return arrayArb.filter((tab) => tab.length >= minLength);
  }

  // node_modules/fast-check/lib/esm/arbitrary/tuple.js
  function tuple(...arbs) {
    const nextArbs = arbs.map((arb) => convertToNext(arb));
    return convertFromNext(new TupleArbitrary(nextArbs));
  }

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/KeyValuePairsToObject.js
  function keyValuePairsToObjectMapper(items) {
    const obj = {};
    for (const keyValue of items) {
      obj[keyValue[0]] = keyValue[1];
    }
    return obj;
  }

  // node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/DepthContext.js
  var depthContextCache = /* @__PURE__ */ new Map();
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

  // node_modules/fast-check/lib/esm/arbitrary/_internals/FrequencyArbitrary.js
  var FrequencyArbitrary = class _FrequencyArbitrary extends NextArbitrary {
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

  // node_modules/fast-check/lib/esm/arbitrary/frequency.js
  function isFrequencyContraints(param) {
    return param != null && typeof param === "object" && !("arbitrary" in param);
  }
  function frequency(...args) {
    const label = "fc.frequency";
    const constraints = args[0];
    if (isFrequencyContraints(constraints)) {
      return FrequencyArbitrary.fromOld(args.slice(1), constraints, label);
    }
    return FrequencyArbitrary.fromOld(args, {}, label);
  }

  // node_modules/fast-check/lib/esm/arbitrary/nat.js
  function nat(arg) {
    const max = typeof arg === "number" ? arg : arg && arg.max !== void 0 ? arg.max : 2147483647;
    if (max < 0) {
      throw new Error("fc.nat value should be greater than or equal to 0");
    }
    const arb = new IntegerArbitrary(0, max);
    return convertFromNextWithShrunkOnce(arb, arb.defaultTarget());
  }

  // node_modules/fast-check/lib/esm/check/arbitrary/helpers/SpecificCharacterRange.js
  var percentCharArb = fullUnicode().map((c) => {
    const encoded = encodeURIComponent(c);
    return c !== encoded ? encoded : `%${c.charCodeAt(0).toString(16)}`;
  });

  // node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/StringConstraintsExtractor.js
  function extractStringConstraints(options) {
    return options[0] !== void 0 ? typeof options[0] === "number" ? typeof options[1] === "number" ? { minLength: options[0], maxLength: options[1] } : { maxLength: options[0] } : options[0] : {};
  }

  // node_modules/fast-check/lib/esm/check/arbitrary/helpers/ArrayInt64.js
  var Zero64 = { sign: 1, data: [0, 0] };
  var Unit64 = { sign: 1, data: [0, 1] };
  function isZero64(a) {
    return a.data[0] === 0 && a.data[1] === 0;
  }
  function isStrictlyNegative64(a) {
    return a.sign === -1 && !isZero64(a);
  }
  function isStrictlyPositive64(a) {
    return a.sign === 1 && !isZero64(a);
  }
  function isEqual64(a, b) {
    if (a.data[0] === b.data[0] && a.data[1] === b.data[1]) {
      return a.sign === b.sign || a.data[0] === 0 && a.data[1] === 0;
    }
    return false;
  }
  function isStrictlySmaller64Internal(a, b) {
    return a[0] < b[0] || a[0] === b[0] && a[1] < b[1];
  }
  function isStrictlySmaller64(a, b) {
    if (a.sign === b.sign) {
      return a.sign === 1 ? isStrictlySmaller64Internal(a.data, b.data) : isStrictlySmaller64Internal(b.data, a.data);
    }
    return a.sign === -1 && (!isZero64(a) || !isZero64(b));
  }
  function clone64(a) {
    return { sign: a.sign, data: [a.data[0], a.data[1]] };
  }
  function substract64DataInternal(a, b) {
    let reminderLow = 0;
    let low = a[1] - b[1];
    if (low < 0) {
      reminderLow = 1;
      low = low >>> 0;
    }
    return [a[0] - b[0] - reminderLow, low];
  }
  function substract64Internal(a, b) {
    if (a.sign === 1 && b.sign === -1) {
      const low = a.data[1] + b.data[1];
      const high = a.data[0] + b.data[0] + (low > 4294967295 ? 1 : 0);
      return { sign: 1, data: [high >>> 0, low >>> 0] };
    }
    return {
      sign: 1,
      data: a.sign === 1 ? substract64DataInternal(a.data, b.data) : substract64DataInternal(b.data, a.data)
    };
  }
  function substract64(arrayIntA, arrayIntB) {
    if (isStrictlySmaller64(arrayIntA, arrayIntB)) {
      const out = substract64Internal(arrayIntB, arrayIntA);
      out.sign = -1;
      return out;
    }
    return substract64Internal(arrayIntA, arrayIntB);
  }
  function negative64(arrayIntA) {
    return {
      sign: -arrayIntA.sign,
      data: [arrayIntA.data[0], arrayIntA.data[1]]
    };
  }
  function add64(arrayIntA, arrayIntB) {
    if (isZero64(arrayIntB)) {
      if (isZero64(arrayIntA)) {
        return clone64(Zero64);
      }
      return clone64(arrayIntA);
    }
    return substract64(arrayIntA, negative64(arrayIntB));
  }
  function halve64(a) {
    return {
      sign: a.sign,
      data: [Math.floor(a.data[0] / 2), (a.data[0] % 2 === 1 ? 2147483648 : 0) + Math.floor(a.data[1] / 2)]
    };
  }
  function logLike64(a) {
    return {
      sign: a.sign,
      data: [0, Math.floor(Math.log(a.data[0] * 4294967296 + a.data[1]) / Math.log(2))]
    };
  }

  // node_modules/fast-check/lib/esm/check/arbitrary/helpers/ArrayInt64Arbitrary.js
  var ArrayInt64Arbitrary = class _ArrayInt64Arbitrary extends NextArbitrary {
    constructor(min, max) {
      super();
      this.min = min;
      this.max = max;
      this.biasedRanges = null;
    }
    generate(mrng, biasFactor) {
      const range = this.computeGenerateRange(mrng, biasFactor);
      const uncheckedValue = mrng.nextArrayInt(range.min, range.max);
      if (uncheckedValue.data.length === 1) {
        uncheckedValue.data.unshift(0);
      }
      return new NextValue(uncheckedValue, void 0);
    }
    computeGenerateRange(mrng, biasFactor) {
      if (biasFactor === void 0 || mrng.nextInt(1, biasFactor) !== 1) {
        return { min: this.min, max: this.max };
      }
      const ranges = this.retrieveBiasedRanges();
      if (ranges.length === 1) {
        return ranges[0];
      }
      const id = mrng.nextInt(-2 * (ranges.length - 1), ranges.length - 2);
      return id < 0 ? ranges[0] : ranges[id + 1];
    }
    canShrinkWithoutContext(value) {
      const unsafeValue = value;
      return typeof value === "object" && value !== null && (unsafeValue.sign === -1 || unsafeValue.sign === 1) && Array.isArray(unsafeValue.data) && unsafeValue.data.length === 2 && (isStrictlySmaller64(this.min, unsafeValue) && isStrictlySmaller64(unsafeValue, this.max) || isEqual64(this.min, unsafeValue) || isEqual64(this.max, unsafeValue));
    }
    shrinkArrayInt64(value, target, tryTargetAsap) {
      const realGap = substract64(value, target);
      function* shrinkGen() {
        let previous = tryTargetAsap ? void 0 : target;
        const gap = tryTargetAsap ? realGap : halve64(realGap);
        for (let toremove = gap; !isZero64(toremove); toremove = halve64(toremove)) {
          const next2 = substract64(value, toremove);
          yield new NextValue(next2, previous);
          previous = next2;
        }
      }
      return stream(shrinkGen());
    }
    shrink(current, context2) {
      if (!_ArrayInt64Arbitrary.isValidContext(current, context2)) {
        const target = this.defaultTarget();
        return this.shrinkArrayInt64(current, target, true);
      }
      if (this.isLastChanceTry(current, context2)) {
        return Stream.of(new NextValue(context2, void 0));
      }
      return this.shrinkArrayInt64(current, context2, false);
    }
    defaultTarget() {
      if (!isStrictlyPositive64(this.min) && !isStrictlyNegative64(this.max)) {
        return Zero64;
      }
      return isStrictlyNegative64(this.min) ? this.max : this.min;
    }
    isLastChanceTry(current, context2) {
      if (isZero64(current)) {
        return false;
      }
      if (current.sign === 1) {
        return isEqual64(current, add64(context2, Unit64)) && isStrictlyPositive64(substract64(current, this.min));
      } else {
        return isEqual64(current, substract64(context2, Unit64)) && isStrictlyNegative64(substract64(current, this.max));
      }
    }
    static isValidContext(_current, context2) {
      if (context2 === void 0) {
        return false;
      }
      if (typeof context2 !== "object" || context2 === null || !("sign" in context2) || !("data" in context2)) {
        throw new Error(`Invalid context type passed to ArrayInt64Arbitrary (#1)`);
      }
      return true;
    }
    retrieveBiasedRanges() {
      if (this.biasedRanges != null) {
        return this.biasedRanges;
      }
      if (isEqual64(this.min, this.max)) {
        this.biasedRanges = [{ min: this.min, max: this.max }];
        return this.biasedRanges;
      }
      const minStrictlySmallerZero = isStrictlyNegative64(this.min);
      const maxStrictlyGreaterZero = isStrictlyPositive64(this.max);
      if (minStrictlySmallerZero && maxStrictlyGreaterZero) {
        const logMin = logLike64(this.min);
        const logMax = logLike64(this.max);
        this.biasedRanges = [
          { min: logMin, max: logMax },
          { min: substract64(this.max, logMax), max: this.max },
          { min: this.min, max: substract64(this.min, logMin) }
        ];
      } else {
        const logGap = logLike64(substract64(this.max, this.min));
        const arbCloseToMin = { min: this.min, max: add64(this.min, logGap) };
        const arbCloseToMax = { min: substract64(this.max, logGap), max: this.max };
        this.biasedRanges = minStrictlySmallerZero ? [arbCloseToMax, arbCloseToMin] : [arbCloseToMin, arbCloseToMax];
      }
      return this.biasedRanges;
    }
  };
  function arrayInt64(min, max) {
    const arb = new ArrayInt64Arbitrary(min, max);
    return convertFromNextWithShrunkOnce(arb, arb.defaultTarget());
  }

  // node_modules/fast-check/lib/esm/check/arbitrary/DoubleNextArbitrary.js
  var INDEX_POSITIVE_INFINITY = { sign: 1, data: [2146435072, 0] };
  var INDEX_NEGATIVE_INFINITY = { sign: -1, data: [2146435072, 1] };
  function decomposeDouble(d) {
    const maxSignificand = 2 - Number.EPSILON;
    for (let exponent = -1022; exponent !== 1024; ++exponent) {
      const powExponent = 2 ** exponent;
      const maxForExponent = maxSignificand * powExponent;
      if (Math.abs(d) <= maxForExponent) {
        return { exponent, significand: d / powExponent };
      }
    }
    return { exponent: Number.NaN, significand: Number.NaN };
  }
  function positiveNumberToInt64(n) {
    return [~~(n / 4294967296), n >>> 0];
  }
  function indexInDoubleFromDecomp(exponent, significand) {
    if (exponent === -1022) {
      const rescaledSignificand2 = significand * 2 ** 52;
      return positiveNumberToInt64(rescaledSignificand2);
    }
    const rescaledSignificand = (significand - 1) * 2 ** 52;
    const exponentOnlyHigh = (exponent + 1023) * 2 ** 20;
    const index = positiveNumberToInt64(rescaledSignificand);
    index[0] += exponentOnlyHigh;
    return index;
  }
  function doubleToIndex(d) {
    if (d === Number.POSITIVE_INFINITY) {
      return clone64(INDEX_POSITIVE_INFINITY);
    }
    if (d === Number.NEGATIVE_INFINITY) {
      return clone64(INDEX_NEGATIVE_INFINITY);
    }
    const decomp = decomposeDouble(d);
    const exponent = decomp.exponent;
    const significand = decomp.significand;
    if (d > 0 || d === 0 && 1 / d === Number.POSITIVE_INFINITY) {
      return { sign: 1, data: indexInDoubleFromDecomp(exponent, significand) };
    } else {
      const indexOpposite = indexInDoubleFromDecomp(exponent, -significand);
      if (indexOpposite[1] === 4294967295) {
        indexOpposite[0] += 1;
        indexOpposite[1] = 0;
      } else {
        indexOpposite[1] += 1;
      }
      return { sign: -1, data: indexOpposite };
    }
  }
  function indexToDouble(index) {
    if (index.sign === -1) {
      const indexOpposite = { sign: 1, data: [index.data[0], index.data[1]] };
      if (indexOpposite.data[1] === 0) {
        indexOpposite.data[0] -= 1;
        indexOpposite.data[1] = 4294967295;
      } else {
        indexOpposite.data[1] -= 1;
      }
      return -indexToDouble(indexOpposite);
    }
    if (isEqual64(index, INDEX_POSITIVE_INFINITY)) {
      return Number.POSITIVE_INFINITY;
    }
    if (index.data[0] < 2097152) {
      return (index.data[0] * 4294967296 + index.data[1]) * 2 ** -1074;
    }
    const postIndexHigh = index.data[0] - 2097152;
    const exponent = -1021 + (postIndexHigh >> 20);
    const significand = 1 + ((postIndexHigh & 1048575) * 2 ** 32 + index.data[1]) * Number.EPSILON;
    return significand * 2 ** exponent;
  }
  function safeDoubleToIndex(d, constraintsLabel) {
    if (Number.isNaN(d)) {
      throw new Error("fc.doubleNext constraints." + constraintsLabel + " must be a 32-bit float");
    }
    return doubleToIndex(d);
  }
  function doubleNext(constraints = {}) {
    const { noDefaultInfinity = false, noNaN = false, min = noDefaultInfinity ? -Number.MAX_VALUE : Number.NEGATIVE_INFINITY, max = noDefaultInfinity ? Number.MAX_VALUE : Number.POSITIVE_INFINITY } = constraints;
    const minIndex = safeDoubleToIndex(min, "min");
    const maxIndex = safeDoubleToIndex(max, "max");
    if (isStrictlySmaller64(maxIndex, minIndex)) {
      throw new Error("fc.doubleNext constraints.min must be smaller or equal to constraints.max");
    }
    if (noNaN) {
      return arrayInt64(minIndex, maxIndex).map(indexToDouble);
    }
    const positiveMaxIdx = isStrictlyPositive64(maxIndex);
    const minIndexWithNaN = positiveMaxIdx ? minIndex : substract64(minIndex, Unit64);
    const maxIndexWithNaN = positiveMaxIdx ? add64(maxIndex, Unit64) : maxIndex;
    return arrayInt64(minIndexWithNaN, maxIndexWithNaN).map((index) => {
      if (isStrictlySmaller64(maxIndex, index) || isStrictlySmaller64(index, minIndex))
        return Number.NaN;
      else
        return indexToDouble(index);
    });
  }

  // node_modules/fast-check/lib/esm/check/arbitrary/FloatNextArbitrary.js
  var MIN_VALUE_32 = 2 ** -126 * 2 ** -23;
  var MAX_VALUE_32 = 2 ** 127 * (1 + (2 ** 23 - 1) / 2 ** 23);
  var EPSILON_32 = 2 ** -23;
  var INDEX_POSITIVE_INFINITY2 = 2139095040;
  var INDEX_NEGATIVE_INFINITY2 = -2139095041;
  function decomposeFloat(f) {
    const maxSignificand = 1 + (2 ** 23 - 1) / 2 ** 23;
    for (let exponent = -126; exponent !== 128; ++exponent) {
      const powExponent = 2 ** exponent;
      const maxForExponent = maxSignificand * powExponent;
      if (Math.abs(f) <= maxForExponent) {
        return { exponent, significand: f / powExponent };
      }
    }
    return { exponent: Number.NaN, significand: Number.NaN };
  }
  function indexInFloatFromDecomp(exponent, significand) {
    if (exponent === -126) {
      return significand * 8388608;
    }
    return (exponent + 127) * 8388608 + (significand - 1) * 8388608;
  }
  function floatToIndex(f) {
    if (f === Number.POSITIVE_INFINITY) {
      return INDEX_POSITIVE_INFINITY2;
    }
    if (f === Number.NEGATIVE_INFINITY) {
      return INDEX_NEGATIVE_INFINITY2;
    }
    const decomp = decomposeFloat(f);
    const exponent = decomp.exponent;
    const significand = decomp.significand;
    if (Number.isNaN(exponent) || Number.isNaN(significand) || !Number.isInteger(significand * 8388608)) {
      return Number.NaN;
    }
    if (f > 0 || f === 0 && 1 / f === Number.POSITIVE_INFINITY) {
      return indexInFloatFromDecomp(exponent, significand);
    } else {
      return -indexInFloatFromDecomp(exponent, -significand) - 1;
    }
  }
  function indexToFloat(index) {
    if (index < 0) {
      return -indexToFloat(-index - 1);
    }
    if (index === INDEX_POSITIVE_INFINITY2) {
      return Number.POSITIVE_INFINITY;
    }
    if (index < 16777216) {
      return index * 2 ** -149;
    }
    const postIndex = index - 16777216;
    const exponent = -125 + (postIndex >> 23);
    const significand = 1 + (postIndex & 8388607) / 8388608;
    return significand * 2 ** exponent;
  }
  function safeFloatToIndex(f, constraintsLabel) {
    const conversionTrick = "you can convert any double to a 32-bit float by using `new Float32Array([myDouble])[0]`";
    const errorMessage = "fc.floatNext constraints." + constraintsLabel + " must be a 32-bit float - " + conversionTrick;
    if (Number.isNaN(f) || Number.isFinite(f) && (f < -MAX_VALUE_32 || f > MAX_VALUE_32)) {
      throw new Error(errorMessage);
    }
    const index = floatToIndex(f);
    if (!Number.isInteger(index)) {
      throw new Error(errorMessage);
    }
    return index;
  }
  function floatNext(constraints = {}) {
    const { noDefaultInfinity = false, noNaN = false, min = noDefaultInfinity ? -MAX_VALUE_32 : Number.NEGATIVE_INFINITY, max = noDefaultInfinity ? MAX_VALUE_32 : Number.POSITIVE_INFINITY } = constraints;
    const minIndex = safeFloatToIndex(min, "min");
    const maxIndex = safeFloatToIndex(max, "max");
    if (minIndex > maxIndex) {
      throw new Error("fc.floatNext constraints.min must be smaller or equal to constraints.max");
    }
    if (noNaN) {
      return integer({ min: minIndex, max: maxIndex }).map(indexToFloat);
    }
    const minIndexWithNaN = maxIndex > 0 ? minIndex : minIndex - 1;
    const maxIndexWithNaN = maxIndex > 0 ? maxIndex + 1 : maxIndex;
    return integer({ min: minIndexWithNaN, max: maxIndexWithNaN }).map((index) => {
      if (index > maxIndex || index < minIndex)
        return Number.NaN;
      else
        return indexToFloat(index);
    });
  }

  // node_modules/fast-check/lib/esm/check/arbitrary/FloatingPointArbitrary.js
  function next(n) {
    return integer(0, (1 << n) - 1);
  }
  var floatInternal = () => {
    return next(24).map((v) => v / (1 << 24));
  };
  function float(...args) {
    if (typeof args[0] === "object") {
      if (args[0].next) {
        return floatNext(args[0]);
      }
      const min = args[0].min !== void 0 ? args[0].min : 0;
      const max = args[0].max !== void 0 ? args[0].max : 1;
      return floatInternal().map((v) => min + v * (max - min)).filter((g) => g !== max || g === min);
    } else {
      const a = args[0];
      const b = args[1];
      if (a === void 0)
        return floatInternal();
      if (b === void 0)
        return floatInternal().map((v) => v * a).filter((g) => g !== a || g === 0);
      return floatInternal().map((v) => a + v * (b - a)).filter((g) => g !== b || g === a);
    }
  }
  var doubleFactor = Math.pow(2, 27);
  var doubleDivisor = Math.pow(2, -53);
  var doubleInternal = () => {
    return tuple(next(26), next(27)).map((v) => (v[0] * doubleFactor + v[1]) * doubleDivisor);
  };
  function double(...args) {
    if (typeof args[0] === "object") {
      if (args[0].next) {
        return doubleNext(args[0]);
      }
      const min = args[0].min !== void 0 ? args[0].min : 0;
      const max = args[0].max !== void 0 ? args[0].max : 1;
      return doubleInternal().map((v) => min + v * (max - min)).filter((g) => g !== max || g === min);
    } else {
      const a = args[0];
      const b = args[1];
      if (a === void 0)
        return doubleInternal();
      if (b === void 0)
        return doubleInternal().map((v) => v * a).filter((g) => g !== a || g === 0);
      return doubleInternal().map((v) => a + v * (b - a)).filter((g) => g !== b || g === a);
    }
  }

  // node_modules/fast-check/lib/esm/check/arbitrary/helpers/TextEscaper.js
  function escapeForTemplateString(originalText) {
    return originalText.replace(/([$`\\])/g, "\\$1").replace(/\r/g, "\\r");
  }

  // node_modules/fast-check/lib/esm/arbitrary/maxSafeInteger.js
  function maxSafeInteger() {
    const arb = new IntegerArbitrary(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    return convertFromNextWithShrunkOnce(arb, arb.defaultTarget());
  }

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

  // node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/CodePointsToString.js
  function codePointsToStringMapper(tab) {
    return tab.join("");
  }
  function codePointsToStringUnmapper(value) {
    if (typeof value !== "string") {
      throw new Error("Cannot unmap the passed value");
    }
    return [...value];
  }

  // node_modules/fast-check/lib/esm/arbitrary/memo.js
  var contextRemainingDepth = 10;
  function memo(builder) {
    const previous = {};
    return (maxDepth) => {
      const n = maxDepth !== void 0 ? maxDepth : contextRemainingDepth;
      if (!Object.prototype.hasOwnProperty.call(previous, n)) {
        const prev = contextRemainingDepth;
        contextRemainingDepth = n - 1;
        previous[n] = builder(n);
        contextRemainingDepth = prev;
      }
      return previous[n];
    };
  }

  // node_modules/fast-check/lib/esm/arbitrary/string.js
  function string2(...args) {
    const constraints = extractStringConstraints(args);
    return convertFromNext(convertToNext(array2(char(), constraints)).map(codePointsToStringMapper, codePointsToStringUnmapper));
  }

  // node_modules/fast-check/lib/esm/arbitrary/float32Array.js
  function float32Array(constraints = {}) {
    return array2(float(Object.assign(Object.assign({}, constraints), { next: true })), constraints).map((data) => Float32Array.from(data));
  }

  // node_modules/fast-check/lib/esm/arbitrary/float64Array.js
  function float64Array(constraints = {}) {
    return array2(double(Object.assign(Object.assign({}, constraints), { next: true })), constraints).map((data) => Float64Array.from(data));
  }

  // node_modules/fast-check/lib/esm/arbitrary/_internals/builders/TypedIntArrayArbitraryBuilder.js
  var __rest = function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  function typedIntArrayArbitraryArbitraryBuilder(constraints, defaultMin, defaultMax, TypedArrayClass, arbitraryBuilder) {
    const generatorName = TypedArrayClass.name;
    const { min = defaultMin, max = defaultMax } = constraints, arrayConstraints = __rest(constraints, ["min", "max"]);
    if (min > max) {
      throw new Error(`Invalid range passed to ${generatorName}: min must be lower than or equal to max`);
    }
    if (min < defaultMin) {
      throw new Error(`Invalid min value passed to ${generatorName}: min must be greater than or equal to ${defaultMin}`);
    }
    if (max > defaultMax) {
      throw new Error(`Invalid max value passed to ${generatorName}: max must be lower than or equal to ${defaultMax}`);
    }
    return array2(arbitraryBuilder({ min, max }), arrayConstraints).map((data) => TypedArrayClass.from(data));
  }

  // node_modules/fast-check/lib/esm/arbitrary/int16Array.js
  function int16Array(constraints = {}) {
    return typedIntArrayArbitraryArbitraryBuilder(constraints, -32768, 32767, Int16Array, integer);
  }

  // node_modules/fast-check/lib/esm/arbitrary/int32Array.js
  function int32Array(constraints = {}) {
    return typedIntArrayArbitraryArbitraryBuilder(constraints, -2147483648, 2147483647, Int32Array, integer);
  }

  // node_modules/fast-check/lib/esm/arbitrary/int8Array.js
  function int8Array(constraints = {}) {
    return typedIntArrayArbitraryArbitraryBuilder(constraints, -128, 127, Int8Array, integer);
  }

  // node_modules/fast-check/lib/esm/arbitrary/uint16Array.js
  function uint16Array(constraints = {}) {
    return typedIntArrayArbitraryArbitraryBuilder(constraints, 0, 65535, Uint16Array, integer);
  }

  // node_modules/fast-check/lib/esm/arbitrary/uint32Array.js
  function uint32Array(constraints = {}) {
    return typedIntArrayArbitraryArbitraryBuilder(constraints, 0, 4294967295, Uint32Array, integer);
  }

  // node_modules/fast-check/lib/esm/arbitrary/uint8Array.js
  function uint8Array(constraints = {}) {
    return typedIntArrayArbitraryArbitraryBuilder(constraints, 0, 255, Uint8Array, integer);
  }

  // node_modules/fast-check/lib/esm/arbitrary/uint8ClampedArray.js
  function uint8ClampedArray(constraints = {}) {
    return typedIntArrayArbitraryArbitraryBuilder(constraints, 0, 255, Uint8ClampedArray, integer);
  }

  // node_modules/fast-check/lib/esm/check/arbitrary/SparseArrayArbitrary.js
  function extractMaxIndex(indexesAndValues) {
    let maxIndex = -1;
    for (let index = 0; index !== indexesAndValues.length; ++index) {
      maxIndex = Math.max(maxIndex, indexesAndValues[index][0]);
    }
    return maxIndex;
  }
  function arrayFromItems(length, indexesAndValues) {
    const array3 = Array(length);
    for (let index = 0; index !== indexesAndValues.length; ++index) {
      const it = indexesAndValues[index];
      if (it[0] < length)
        array3[it[0]] = it[1];
    }
    return array3;
  }
  function sparseArray(arb, constraints = {}) {
    const { minNumElements = 0, maxNumElements = maxLengthFromMinLength(minNumElements), maxLength = Math.min(maxLengthFromMinLength(maxNumElements), 4294967295), noTrailingHole } = constraints;
    if (minNumElements > maxLength) {
      throw new Error(`The minimal number of non-hole elements cannot be higher than the maximal length of the array`);
    }
    if (minNumElements > maxNumElements) {
      throw new Error(`The minimal number of non-hole elements cannot be higher than the maximal number of non-holes`);
    }
    const resultedMaxNumElements = Math.min(maxNumElements, maxLength);
    if (noTrailingHole) {
      const maxIndexAuthorized = Math.max(maxLength - 1, 0);
      return set(tuple(nat(maxIndexAuthorized), arb), {
        minLength: minNumElements,
        maxLength: resultedMaxNumElements,
        compare: (itemA, itemB) => itemA[0] === itemB[0]
      }).map((items) => {
        const lastIndex = extractMaxIndex(items);
        return arrayFromItems(lastIndex + 1, items);
      });
    }
    return set(tuple(nat(maxLength), arb), {
      minLength: minNumElements + 1,
      maxLength: resultedMaxNumElements + 1,
      compare: (itemA, itemB) => itemA[0] === itemB[0]
    }).map((items) => {
      const length = extractMaxIndex(items);
      return arrayFromItems(length, items);
    });
  }

  // node_modules/fast-check/lib/esm/check/arbitrary/ObjectArbitrary.js
  function boxArbitrary(arb) {
    return arb.map((v) => {
      switch (typeof v) {
        case "boolean":
          return new Boolean(v);
        case "number":
          return new Number(v);
        case "string":
          return new String(v);
        default:
          return v;
      }
    });
  }
  var QualifiedObjectConstraints = class _QualifiedObjectConstraints {
    constructor(key, values, maxDepth, maxKeys, withSet, withMap, withObjectString, withNullPrototype, withBigInt, withDate, withTypedArray, withSparseArray) {
      this.key = key;
      this.values = values;
      this.maxDepth = maxDepth;
      this.maxKeys = maxKeys;
      this.withSet = withSet;
      this.withMap = withMap;
      this.withObjectString = withObjectString;
      this.withNullPrototype = withNullPrototype;
      this.withBigInt = withBigInt;
      this.withDate = withDate;
      this.withTypedArray = withTypedArray;
      this.withSparseArray = withSparseArray;
    }
    static defaultValues() {
      return [
        boolean(),
        maxSafeInteger(),
        double({ next: true }),
        string2(),
        oneof(string2(), constant(null), constant(void 0))
      ];
    }
    static boxArbitraries(arbs) {
      return arbs.map((arb) => boxArbitrary(arb));
    }
    static boxArbitrariesIfNeeded(arbs, boxEnabled) {
      return boxEnabled ? _QualifiedObjectConstraints.boxArbitraries(arbs).concat(arbs) : arbs;
    }
    static from(settings = {}) {
      function orDefault(optionalValue, defaultValue) {
        return optionalValue !== void 0 ? optionalValue : defaultValue;
      }
      return new _QualifiedObjectConstraints(orDefault(settings.key, string2()), _QualifiedObjectConstraints.boxArbitrariesIfNeeded(orDefault(settings.values, _QualifiedObjectConstraints.defaultValues()), orDefault(settings.withBoxedValues, false)), orDefault(settings.maxDepth, 2), orDefault(settings.maxKeys, 5), orDefault(settings.withSet, false), orDefault(settings.withMap, false), orDefault(settings.withObjectString, false), orDefault(settings.withNullPrototype, false), orDefault(settings.withBigInt, false), orDefault(settings.withDate, false), orDefault(settings.withTypedArray, false), orDefault(settings.withSparseArray, false));
    }
  };
  var anythingInternal = (constraints) => {
    const arbKeys = constraints.withObjectString ? memo((n) => frequency({ arbitrary: constraints.key, weight: 10 }, { arbitrary: anythingArb(n).map((o) => stringify(o)), weight: 1 })) : memo(() => constraints.key);
    const arbitrariesForBase = constraints.values;
    const maxDepth = constraints.maxDepth;
    const maxKeys = constraints.maxKeys;
    const entriesOf = (keyArb, valueArb) => set(tuple(keyArb, valueArb), { maxLength: maxKeys, compare: (t1, t2) => t1[0] === t2[0] });
    const mapOf = (ka, va) => entriesOf(ka, va).map((v) => new Map(v));
    const dictOf = (ka, va) => entriesOf(ka, va).map((v) => keyValuePairsToObjectMapper(v));
    const baseArb = oneof(...arbitrariesForBase);
    const arrayBaseArb = oneof(...arbitrariesForBase.map((arb) => array2(arb, { maxLength: maxKeys })));
    const objectBaseArb = (n) => oneof(...arbitrariesForBase.map((arb) => dictOf(arbKeys(n), arb)));
    const setBaseArb = () => oneof(...arbitrariesForBase.map((arb) => set(arb, { maxLength: maxKeys }).map((v) => new Set(v))));
    const mapBaseArb = (n) => oneof(...arbitrariesForBase.map((arb) => mapOf(arbKeys(n), arb)));
    const arrayArb = memo((n) => oneof(arrayBaseArb, array2(anythingArb(n), { maxLength: maxKeys })));
    const setArb = memo((n) => oneof(setBaseArb(), set(anythingArb(n), { maxLength: maxKeys }).map((v) => new Set(v))));
    const mapArb = memo((n) => oneof(mapBaseArb(n), oneof(mapOf(arbKeys(n), anythingArb(n)), mapOf(anythingArb(n), anythingArb(n)))));
    const objectArb = memo((n) => oneof(objectBaseArb(n), dictOf(arbKeys(n), anythingArb(n))));
    const anythingArb = memo((n) => {
      if (n <= 0)
        return oneof(baseArb);
      return oneof(baseArb, arrayArb(), objectArb(), ...constraints.withMap ? [mapArb()] : [], ...constraints.withSet ? [setArb()] : [], ...constraints.withObjectString ? [anythingArb().map((o) => stringify(o))] : [], ...constraints.withNullPrototype ? [objectArb().map((o) => Object.assign(/* @__PURE__ */ Object.create(null), o))] : [], ...constraints.withBigInt ? [bigInt()] : [], ...constraints.withDate ? [date()] : [], ...constraints.withTypedArray ? [
        oneof(int8Array(), uint8Array(), uint8ClampedArray(), int16Array(), uint16Array(), int32Array(), uint32Array(), float32Array(), float64Array())
      ] : [], ...constraints.withSparseArray ? [sparseArray(anythingArb())] : []);
    });
    return anythingArb(maxDepth);
  };
  function anything(constraints) {
    return anythingInternal(QualifiedObjectConstraints.from(constraints));
  }
  function jsonSettings(stringArbitrary, constraints) {
    const key = stringArbitrary;
    const values = [
      boolean(),
      maxSafeInteger(),
      double({ next: true, noDefaultInfinity: true, noNaN: true }),
      stringArbitrary,
      constant(null)
    ];
    return constraints != null ? typeof constraints === "number" ? { key, values, maxDepth: constraints } : { key, values, maxDepth: constraints.maxDepth } : { key, values };
  }
  function jsonObject(constraints) {
    return anything(jsonSettings(string2(), constraints));
  }
  function json2(constraints) {
    const arb = constraints != null ? jsonObject(constraints) : jsonObject();
    return arb.map(JSON.stringify);
  }

  // node_modules/fast-check/lib/esm/arbitrary/_internals/builders/PartialRecordArbitraryBuilder.js
  var noKeyValue = Symbol("no-key");

  // node_modules/fast-check/lib/esm/check/model/commands/CommandsIterable.js
  var CommandsIterable = class _CommandsIterable {
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

  // node_modules/fast-check/lib/esm/arbitrary/_internals/implementations/SchedulerImplem.js
  var SchedulerImplem = class _SchedulerImplem {
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
        ...this.scheduledTasks.map((t) => ({
          status: "pending",
          schedulingType: t.schedulingType,
          taskId: t.taskId,
          label: t.label,
          metadata: t.metadata
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

  // src/test/jsontests.ts
  (0, import_tester.test)("Test arbitrary JSON data", async (t) => assert(
    property(json2(), (str) => {
      let obj1 = JSON.parse(str);
      let obj2 = parseJson(str);
      t.deepEqual(obj2, obj1, JSON.stringify(obj2) + " should be deep equal to " + JSON.stringify(obj1));
    })
  ));

  // src/components/run-json-tests.ts
  var JsonParser = class extends import_custom_elem.StyledElement {
    constructor() {
      super("run-json-tests");
      this.body.classList.add("json-editor");
      this.textarea = document.createElement("textarea");
      this.textarea.cols = 40;
      this.textarea.rows = 10;
      this.result = document.createElement("div");
      this.result.classList.add("result");
      this.body.append(this.textarea, this.result);
    }
    connect() {
      this.textarea.addEventListener("input", (_) => {
        try {
          this.result.innerText = JSON.stringify(parseJson(
            this.textarea.value
          ), void 0, 2);
        } catch (e) {
          if (e instanceof ParseError)
            this.result.innerText = e.message;
          else
            throw e;
        }
      });
    }
  };
  customElements.define("json-parser", JsonParser);
})();
//# sourceMappingURL=run-json-tests.js.map
