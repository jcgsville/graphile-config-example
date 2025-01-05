/**
 * These are the public exports for this library available by importing/requiring:
 *
 * `import { run } from 'graphile-config-example'`
 */

export { BasicAuthenticationPreset } from "./config/presets/basic-authentication-preset.js";

import type { GraphileConfig } from "graphile-config";

import { getServer } from "./get-server.js";
import { coalescePresetWithDefaults } from "./config/preset.js";
import { getExampleMiddleware } from "./config/middleware.js";

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
