import { run, bench, lineplot } from "mitata";
import { shuffle } from "../util.js";
import isInteractive from "is-interactive";

lineplot(() => {
  bench("dynamic ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map((_, index) => index);
    shuffle(input);

    yield () => {
      const out = [];
      input.forEach((x) => out.push(x));
      return out;
    };
  }).range("size", 4096, 1024 ** 2);

  bench("preallocation ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map((_, index) => index);
    shuffle(input);

    yield () => {
      const out = new Array(input.length);
      input.forEach((x, i) => {
        out[i] = x;
      });
      return out;
    };
  }).range("size", 4096, 1024 ** 2);
});

await run({ format: isInteractive() ? "mitata" : "json" });
