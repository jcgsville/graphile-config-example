import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { loadConfig } from "graphile-config/load";
import { resolvePreset } from "graphile-config";

import { run } from "./run.js";

/**
 * As a library author, you might decide to expose a CLI interface for your library. If you do, you
 * might want to make some options configurable via CLI arguments.
 *
 * By convention, options set via CLI arguments should take precedence over all other sources of
 * configuration. For example, if a user of this example project uses the `--port/-P` option, it
 * should override the `example.port` option set in the user-provided preset, and it should override
 * any default set by the library.
 */
const argv = yargs(hideBin(process.argv))
  .option("config", {
    alias: "C",
    description: "The path to the config file",
    normalize: true,
  })
  .string("config")
  .option("port", {
    alias: "P",
    description: "The port on which the server will listen",
    normalize: true,
    type: "number",
  })
  .number("port")
  .strict(true)
  .parseSync();

const main = async (): Promise<void> => {
  const userPreset = await loadConfig(argv.config);
  const argvPreset = extendUserPresetWithArgv(userPreset);
  const resolvedPreset = resolvePreset(argvPreset);

  await run(resolvedPreset);
};

/**
 * We can leverage
 * [preset composition](https://star.graphile.org/graphile-config/preset#preset-composition)
 * to extend the user-provided preset with values from the CLI arguments.
 */
const extendUserPresetWithArgv = (
  userPreset: GraphileConfig.Preset | null,
): GraphileConfig.Preset => ({
  extends: userPreset ? [userPreset] : [],
  example: {
    // The `?? userPreset?.example?.port` is essential. Otherwise, omitting the `--port/-P`
    // CLI option will result in `port: undefined` for this preset, which will overwrite
    // any port set in `userPreset`.
    port: argv.port ?? userPreset?.example?.port,
  },
});

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
