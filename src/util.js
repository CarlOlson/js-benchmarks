import process from "node:process";

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export async function stdinToString() {
  const { promise, resolve } = Promise.withResolvers();

  let content = "";

  process.stdin.resume();

  process.stdin.on("data", function (buf) {
    content += buf.toString();
  });

  process.stdin.on("end", async function () {
    resolve(content);
  });

  return await promise;
}
