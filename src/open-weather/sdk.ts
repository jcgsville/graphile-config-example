import { z } from "zod";

const OPEN_WEATHER_API_BASE_URL = "https://api.openweathermap.org";

const CURRENT_WEATHER_API_PATH = "/data/2.5/weather";

const CURRENT_WEATHER_RESPONSE_SCHEMA = z.object({
  main: z.object({
    temp: z.number(),
  }),
});

export const getCurrentTemperatureKelvin = async (
  openWeatherOptions: GraphileConfig.CoalescedOpenWeatherOptions,
  lat: number,
  lon: number,
): Promise<number> => {
  const url = new URL(OPEN_WEATHER_API_BASE_URL);
  url.pathname = CURRENT_WEATHER_API_PATH;
  url.searchParams.set("lat", lat.toString());
  url.searchParams.set("lon", lon.toString());
  url.searchParams.set("appid", openWeatherOptions.apiKey);

  const response = await fetch(url.toString());

  // Simple error handling for now. Would probably want to do expose better
  //errors in a real project.
  if (!response.ok) {
    console.error("OpenWeather API request failed", await response.text());
    throw new Error("OpenWeather API request failed");
  }

  // Ensure that the response is in the format we expect.
  const responseBody = CURRENT_WEATHER_RESPONSE_SCHEMA.parse(
    await response.json(),
  );

  // main.temp is the temperature in Kelvin.
  return responseBody.main.temp;
};
