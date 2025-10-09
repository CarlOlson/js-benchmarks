import { run, bench, lineplot } from "mitata";
import { shuffle } from "../util.js";
import isInteractive from "is-interactive";

lineplot(() => {
  bench("Map.groupBy ($size/$groups)", function* (state) {
    const size = state.get("size");
    const groups = state.get("groups");
    const input = Array.from({ length: size }).map((_, index) => ({
      index,
    }));
    shuffle(input);

    yield () => Map.groupBy(input, (x) => x.index % groups);
  })
    .range("size", 4096, 1024 ** 2)
    .args("groups", [1024]);

  bench("Map groups from for-of-loop ($size/$groups)", function* (state) {
    const size = state.get("size");
    const groups = state.get("groups");
    const input = Array.from({ length: size }).map((_, index) => ({
      index,
    }));
    shuffle(input);

    yield () => {
      const map = new Map();
      for (const x of input) {
        const key = x.index % groups;
        const value = map.get(key);
        if (value) {
          value.push(x);
        } else {
          map.set(key, [x]);
        }
      }
      return map;
    };
  })
    .range("size", 4096, 1024 ** 2)
    .args("groups", [1024]);
});

await run({ format: isInteractive() ? "mitata" : "json" });
