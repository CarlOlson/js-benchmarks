import { run, bench, lineplot } from "mitata";
import { scheduler } from "node:timers/promises";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { shuffle } from "../util.js";
import isInteractive from "is-interactive";

const minSize = 1024 * 4;
const maxSize = 1024 * 64;

lineplot(() => {
  bench("async -> array chain ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map((_, i) => i);
    shuffle(input);

    yield async () =>
      (
        await Array.fromAsync(input, async (i) => {
          await scheduler.yield();
          return i * i;
        })
      )
        .map((i) => i | 0)
        .map((i) => i >> 2)
        .map((i) => i * 2)
        .map((i) => (i ? i : 0));
  }).range("size", minSize, maxSize);

  bench("async -> iterator chain ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map((_, i) => i);
    shuffle(input);

    yield async () =>
      (
        await Array.fromAsync(input, async (i) => {
          await scheduler.yield();
          return i * i;
        })
      )
        .values()
        .map((i) => i | 0)
        .map((i) => i >> 2)
        .map((i) => i * 2)
        .map((i) => (i ? i : 0));
  }).range("size", minSize, maxSize);

  bench("async iterator chain ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map((_, i) => i);
    shuffle(input);

    yield async () =>
      await Array.fromAsync(fn4(fn3(fn2(fn1(fromAsync(input))))));
  }).range("size", minSize, maxSize);

  bench("stream ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map((_, i) => i);
    shuffle(input);

    yield async () => {
      const out = new Array(size);
      await pipeline(
        fromAsync(input),
        fn1,
        fn2,
        fn3,
        fn4,
        async function* (source) {
          for await (const chunk of source) {
            out.push(chunk);
          }
        },
      );
      return out;
    };
  }).range("size", minSize, maxSize);

  bench("stream helpers ($size)", function* (state) {
    const size = state.get("size");
    const input = Array.from({ length: size }).map((_, i) => i);
    shuffle(input);

    yield async () =>
      await Readable.from(input)
        .map((i) => i * i)
        .map((i) => i | 0)
        .map((i) => i >> 2)
        .map((i) => i * 2)
        .map((i) => (i ? i : 0))
        .toArray();
  }).range("size", minSize, maxSize);
});

await run({ format: isInteractive() ? "mitata" : "json" });

async function* fromAsync(input) {
  for (const i of input) {
    await scheduler.yield();
    yield i * i;
  }
}

async function* fn1(input) {
  for await (const i of input) {
    yield i | 0;
  }
}

async function* fn2(input) {
  for await (const i of input) {
    yield i >> 2;
  }
}

async function* fn3(input) {
  for await (const i of input) {
    yield i * 2;
  }
}

async function* fn4(input) {
  for await (const i of input) {
    yield i ? i : 0;
  }
}
