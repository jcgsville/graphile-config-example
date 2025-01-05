import type { GraphileConfig } from "graphile-config";

import { coalesceOpenWeatherOptionsWithDefaults } from "../open-weather/config.js";
import { coalesceExampleOptionsWithDefaults } from "./options.js";
import { CoalescedPreset } from "../interfaces.js";

export const coalescePresetWithDefaults = (
  preset: GraphileConfig.Preset,
): CoalescedPreset => {
  return {
    ...preset,
    example: coalesceExampleOptionsWithDefaults(preset.example),
    openWeather: coalesceOpenWeatherOptionsWithDefaults(preset.openWeather),
  };
};
