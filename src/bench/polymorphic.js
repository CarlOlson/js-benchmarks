import { run, bench, lineplot } from "mitata";
import { shuffle } from "../util.js";
import isInteractive from "is-interactive";

// TODO increase complexity of these functions, currently they seem to be inlined and optimized away...
function update1(x, cb) {
  return x.map((x) => (x | 0) + 1);
}

function update2(x) {
  return x.map((x) => (x | 0) + 1);
}

lineplot(() => {
  bench("monomorphic ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map((_, index) => ({
      index,
    }));
    shuffle(input);

    yield () => update1(input);
  }).range("size", 4096, 1024 ** 2);

  bench("polymorphic ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map((_, index) => ({
      index,
    }));
    shuffle(input);

    const holey = [1, 2, 3];
    holey.length = 10;
    update2(holey);
    update2(["1", "2", "3"]);
    update2([1.1, 2.2, 3.3]);
    update2(["1", 2, 3.3]);

    yield () => update2(input);
  }).range("size", 4096, 1024 ** 2);
});

await run({ format: isInteractive() ? "mitata" : "json" });
