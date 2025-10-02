import ejs from "ejs";
import path from "node:path";
import { stdinToString } from "./util.js";

const templatePath = path.join(import.meta.dirname, "./gnuplot.ejs");

const data = {
  title: process.argv[2] ?? "",
  output: process.argv[3] ?? "out.png",
  xlabel: "",
  ylabel: "µs",
  xtics: [],
  runs: [],
};

const json = JSON.parse(await stdinToString());

updateLabels(json);

data.runs = json["benchmarks"].map(processBenchmark);

console.log(await ejs.renderFile(templatePath, data, {}));

function processBenchmark({ runs, alias, args }) {
  return {
    name: alias,
    points: runs.map((run) => [
      run.args[data.xlabel],
      run.stats.avg / 1_000_000,
    ]),
  };
}

function updateLabels(json) {
  const { args } = json["benchmarks"][0];
  data.xlabel = Object.keys(args)[0];
  data.xtics = args[data.xlabel];
}
