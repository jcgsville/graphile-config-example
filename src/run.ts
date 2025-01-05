import type { GraphileConfig } from "graphile-config";

import { getServer } from "./get-server.js";
import { coalescePresetWithDefaults } from "./config/preset.js";
import { getExampleMiddleware } from "./config/middleware.js";

export const run = async (preset: GraphileConfig.Preset): Promise<void> => {
  const coalescedPreset = coalescePresetWithDefaults(preset);
  const middleware = getExampleMiddleware(coalescedPreset);

  const server = getServer(coalescedPreset, middleware);
  return new Promise((resolve) => {
    server.listen(coalescedPreset.example.port, () => {
      console.log(
        `Server is listening on port ${String(coalescedPreset.example.port)}`,
      );
      resolve();
    });
  });
};
