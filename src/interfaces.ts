import http from "node:http";

export interface MiddlewareContext {
  coalescedPreset: CoalescedPreset;
}

/**
 * By extending `Record<string, unknown>`, we allow plugins to add additional
 * fields to the event object for use by other plugins. Those other plugins
 * cannot rely on Typescript to enforce that those fields are present, so they
 * should check for them explicitly before using them.
 */
export interface HandleRequestMiddlewareEvent extends Record<string, unknown> {
  context: MiddlewareContext;
  request: http.IncomingMessage;
  response: http.ServerResponse;
}

export interface ExampleMiddleware {
  handleRequest(event: HandleRequestMiddlewareEvent): void;
}

export interface CoalescedPreset extends GraphileConfig.Preset {
  example: CoalescedExampleOptions;
  openWeather: CoalescedOpenWeatherOptions;
}

export interface CoalescedOpenWeatherOptions {
  apiKey: string;
}

export interface CoalescedExampleOptions extends GraphileConfig.ExampleOptions {
  port: number;
}
