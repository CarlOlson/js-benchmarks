// These are adapted from this blog post:
//   https://thorstenlorenz.wordpress.com/2012/06/02/performance-concerns-for-nested-javascript-functions/

import { run, bench, lineplot } from "mitata";
import { shuffle } from "../util.js";
import isInteractive from "is-interactive";

const minSize = 1024 * 4;
const maxSize = 1024 * 64;

lineplot(() => {
  bench("not nested ($size)", function* (state) {
    const size = state.get("size");
    yield () => notNested(size);
  }).range("size", minSize, maxSize);

  bench("nested ($size)", function* (state) {
    const size = state.get("size");
    yield () => nested(size);
  }).range("size", minSize, maxSize);

  bench("nested return ($size)", function* (state) {
    const size = state.get("size");
    yield () => nestedReturning(size);
  }).range("size", minSize, maxSize);
});

await run({ format: isInteractive() ? "mitata" : "json" });

function notNested(size) {
  function foo() {
    return 0;
  }

  function bar() {
    foo();
  }

  for (let i = 0; i < size; i++) {
    bar();
  }
}

function nested(size) {
  function bar() {
    function foo() {
      return 0;
    }
    foo();
  }

  for (let i = 0; i < size; i++) {
    bar();
  }
}

function nestedReturning(size) {
  const bar = (function () {
    function foo() {
      return 0;
    }

    return function () {
      foo();
    };
  })();

  for (let i = 0; i < size; i++) {
    bar();
  }
}
