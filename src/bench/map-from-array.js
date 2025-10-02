import { run, bench, lineplot } from "mitata";
import { shuffle } from "../util.js";
import isInteractive from "is-interactive";

lineplot(() => {
  bench("Map from array.map ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map((_, index) => ({
      index,
    }));
    shuffle(input);

    yield () => new Map(input.map((x) => [x.index, x]));
  }).range("size", 4096, 1024 ** 2);

  bench("Map from array.values.map ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map((_, index) => ({
      index,
    }));
    shuffle(input);

    yield () => new Map(input.values().map((x) => [x.index, x]));
  }).range("size", 4096, 1024 ** 2);

  bench("Map from for-of-loop ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map((_, index) => ({
      index,
    }));
    shuffle(input);

    yield () => {
      const map = new Map();
      for (const x of input) {
        map.set(x.input, x);
      }
      return map;
    };
  }).range("size", 4096, 1024 ** 2);
});

await run({ format: isInteractive() ? "mitata" : "json" });
