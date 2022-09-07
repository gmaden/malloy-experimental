import { exec } from "child_process";
import { Command } from "commander";

const program = new Command();

program
  .name("malloy-cli")
  .description("CLI tool for exploring datasets using Malloy.")
  .version("0.0.1")
  .option("-p, --port <integer>", "server port to listen on", "50021");

program.parse();

let exploreProcess = exec("node dist/cli/static-server.js", {
  env: { PORT: `${program.opts().port}` },
});

exploreProcess.stdout?.pipe(process.stdout);
exploreProcess.stderr?.pipe(process.stderr);
