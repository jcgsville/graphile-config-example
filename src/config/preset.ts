import type { GraphileConfig } from "graphile-config";

import { coalesceOpenWeatherOptionsWithDefaults } from "../open-weather/config.js";
import { coalesceExampleOptionsWithDefaults } from "./options.js";

export const coalescePresetWithDefaults = (
  preset: GraphileConfig.Preset,
): GraphileConfig.CoalescedPreset => {
  return {
    ...preset,
    example: coalesceExampleOptionsWithDefaults(preset.example),
    openWeather: coalesceOpenWeatherOptionsWithDefaults(preset.openWeather),
  };
};
