import http from "node:http";

export interface MiddlewareContext {
  resolvedPreset: GraphileConfig.ResolvedPreset;
  apiKey: string;
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
