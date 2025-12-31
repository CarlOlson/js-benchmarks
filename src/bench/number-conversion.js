import { run, bench, lineplot } from "mitata";
import { shuffle } from "../util.js";
import isInteractive from "is-interactive";

const minSize = 1024 * 4;
const maxSize = 1024 * 1024;

lineplot(() => {
  bench("unary plus ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map(() => String(Math.random()));
    shuffle(input);

    yield () => +input;
  }).range("size", minSize, maxSize);

  bench("number constructor ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map(() => String(Math.random()));
    shuffle(input);

    yield () => Number(input);
  }).range("size", minSize, maxSize);

  bench("parseFloat ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map(() => String(Math.random()));
    shuffle(input);

    yield () => parseFloat(input);
  }).range("size", minSize, maxSize);
});

await run({ format: isInteractive() ? "mitata" : "json" });
