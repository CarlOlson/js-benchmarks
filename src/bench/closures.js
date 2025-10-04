import { run, bench, lineplot } from "mitata";
import { shuffle } from "../util.js";
import isInteractive from "is-interactive";

function fn1(x) {
  return x + 1;
}
function fn2(x) {
  return x * 2;
}
function fn3(x) {
  return x | 0;
}
function fn4(x) {
  return x << 1;
}
function fn5(x) {
  return x - 1;
}

lineplot(() => {
  bench("arrow functions ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map((_, index) => ({
      index,
    }));
    shuffle(input);

    yield () =>
      input
        .map((x) => x + 1)
        .map((x) => x * 2)
        .map((x) => x | 0)
        .map((x) => x << 1)
        .map((x) => x - 1);
  }).range("size", 4096, 1024 ** 2);

  bench("inline functions ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map((_, index) => ({
      index,
    }));
    shuffle(input);

    yield () =>
      input
        .map(function (x) {
          return x + 1;
        })
        .map(function (x) {
          return x * 2;
        })
        .map(function (x) {
          return x | 0;
        })
        .map(function (x) {
          return x << 1;
        })
        .map(function (x) {
          return x - 1;
        });
  }).range("size", 4096, 1024 ** 2);

  bench("toplevel functions ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map((_, index) => ({
      index,
    }));
    shuffle(input);

    yield () => input.map(fn1).map(fn2).map(fn3).map(fn4).map(fn5);
  }).range("size", 4096, 1024 ** 2);
});

await run({ format: isInteractive() ? "mitata" : "json" });
