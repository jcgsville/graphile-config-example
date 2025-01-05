import http from "node:http";
import { z } from "zod";

import { getCurrentTemperatureKelvin } from "./open-weather/sdk.js";
import type { Middleware } from "graphile-config";
import type {
  ExampleMiddleware,
  HandleRequestMiddlewareEvent,
  MiddlewareContext,
} from "./interfaces.js";
import {
  respondWithBadRequest,
  respondWithInternalServerError,
  respondWithNotFound,
  respondWithSuccess,
} from "./response-utils.js";
import { getDefaultAPIKey } from "./open-weather/config.js";
import { getNumberEnvironmentVariable } from "./env-utils.js";

/**
 * The use of Zod and Node's http are not related to Graphile Config. We use them
 * simply to demonstrate how one might use Graphile Config in a project that runs
 * an HTTP server.
 *
 * If you are creating a larger project, you may choose to use a more sophisticated
 * HTTP server library like [Koa](https://koajs.com/) or
 * [Express](https://expressjs.com/).
 */

const CURRENT_TEMPERATURE_SEARCH_PARAM_SCHEMA = z.object({
  lat: z.coerce.number().finite(),
  lon: z.coerce.number().finite(),
});

export const getServer = (
  resolvedPreset: GraphileConfig.ResolvedPreset,
  middleware: Middleware<ExampleMiddleware>,
): http.Server => {
  const { openWeather: { apiKey = getDefaultAPIKey() } = {} } = resolvedPreset;
  const context: MiddlewareContext = { resolvedPreset, apiKey };
  const server = http.createServer((request, response) => {
    const event: HandleRequestMiddlewareEvent = {
      context,
      request,
      response,
    };

    // By using `runSync`, we require that all middleware functions are synchronous.
    // If they need to do anything asynchronous, they should use next.callback().
    //
    // We could, instead, use `run()` if we had a use case that benefited from
    // asynchronous middleware.
    middleware.runSync("handleRequest", event, ({ request, response }) => {
      const url = constructRequestUrl(request);
      if (!url) {
        respondWithInternalServerError(response);
        return;
      }

      if (request.method === "GET" && url.pathname === "/current-temperature") {
        handleCurrentTemperatureRequest(context, url, response);
        return;
      }

      respondWithNotFound(response);
    });
  });
  return server;
};

const handleCurrentTemperatureRequest = (
  context: MiddlewareContext,
  requestUrl: URL,
  response: http.ServerResponse,
): void => {
  const parseResult = CURRENT_TEMPERATURE_SEARCH_PARAM_SCHEMA.safeParse(
    Object.fromEntries(requestUrl.searchParams),
  );

  if (parseResult.success) {
    getCurrentTemperatureKelvin(
      context.apiKey,
      Number(parseResult.data.lat),
      Number(parseResult.data.lon),
    )
      .then((temperatureKelvin) => {
        respondWithSuccess(response, { temperatureKelvin });
      })
      .catch((error: unknown) => {
        console.error(error);
        respondWithInternalServerError(response);
      });
  } else {
    respondWithBadRequest(response, {
      queryParams: parseResult.error,
    });
  }
};

const constructRequestUrl = (request: http.IncomingMessage): URL | null => {
  if (request.url && request.headers.host) {
    return new URL(request.url, `http://${request.headers.host}`);
  }

  return null;
};

export function getDefaultPort() {
  return getNumberEnvironmentVariable("PORT") ?? 4000;
}
