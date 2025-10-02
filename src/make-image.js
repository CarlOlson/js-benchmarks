import ejs from "ejs";
import path from "node:path";

let content = "";

const templatePath = path.join(import.meta.dirname, "./gnuplot.ejs");

const data = {
  title: process.argv[2] ?? "",
  output: process.argv[3] ?? "out.png",
  xlabel: "",
  ylabel: "µs",
  xtics: [],
  runs: [],
};

process.stdin.resume();

process.stdin.on("data", function (buf) {
  content += buf.toString();
});

process.stdin.on("end", async function () {
  const json = JSON.parse(content);

  updateLabels(json);

  data.runs = json["benchmarks"].map(processBenchmark);

  console.log(await ejs.renderFile(templatePath, data, {}));
});

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
