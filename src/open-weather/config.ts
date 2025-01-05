import { requireEnvironmentVariable } from "../env-utils.js";

export const OPEN_WEATHER_API_KEY_ENVIRONMENT_VARIABLE_NAME =
  "OPEN_WEATHER_API_KEY";
const MISSING_OPEN_WEATHER_API_KEY_ERROR_MESSAGE =
  "Missing OpenWeather API Key. Set it in your preset at the path openWeather.apiKey " +
  `or in your environment variables as ${OPEN_WEATHER_API_KEY_ENVIRONMENT_VARIABLE_NAME}.`;

export const coalesceOpenWeatherOptionsWithDefaults = (
  openWeatherOptions?: GraphileConfig.OpenWeatherOptions,
): GraphileConfig.CoalescedOpenWeatherOptions => {
  return {
    apiKey:
      openWeatherOptions?.apiKey ??
      requireEnvironmentVariable(
        OPEN_WEATHER_API_KEY_ENVIRONMENT_VARIABLE_NAME,
        MISSING_OPEN_WEATHER_API_KEY_ERROR_MESSAGE,
      ),
  };
};
