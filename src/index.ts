/**
 * These are the public exports for this library available by importing/requiring:
 *
 * `import { run } from 'graphile-config-example'`
 */

export { BasicAuthenticationPreset } from "./config/presets/basic-authentication-preset.js";

import { Middleware, GraphileConfig, orderedApply } from "graphile-config";

import { getServer } from "./get-server.js";
import { coalescePresetWithDefaults } from "./config/preset.js";
import { ExampleMiddleware } from "./interfaces.js";

export async function run(preset: GraphileConfig.Preset) {
  const coalescedPreset = coalescePresetWithDefaults(preset);
  const middleware = getExampleMiddleware(coalescedPreset);

  const server = getServer(coalescedPreset, middleware);
  return new Promise<void>((resolve) => {
    server.listen(coalescedPreset.example.port, () => {
      console.log(
        `Server is listening on port ${String(coalescedPreset.example.port)}`,
      );
      resolve();
    });
  });
}

function getExampleMiddleware(coalescedPreset: GraphileConfig.CoalescedPreset) {
  const middleware = new Middleware<ExampleMiddleware>();
  orderedApply(
    coalescedPreset.plugins,
    (plugin) => plugin.example?.middleware,
    (name, middlewareFunction) => {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-explicit-any
      middleware.register(name, middlewareFunction as any);
    },
  );
  return middleware;
}
