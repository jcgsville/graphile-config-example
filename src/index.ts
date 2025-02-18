import {
  Middleware,
  GraphileConfig,
  orderedApply,
  MiddlewareHandlers,
  resolvePreset,
} from "graphile-config";
import http from "node:http";
import { z } from "zod";

import type {
  ExampleMiddleware,
  HandleRequestMiddlewareEvent,
  MiddlewareContext,
} from "./interfaces.js";
import {
  getCurrentTemperatureKelvin,
  getDefaultAPIKey,
} from "./open-weather.js";
import {
  respondWithBadRequest,
  respondWithInternalServerError,
  respondWithNotFound,
  respondWithSuccess,
  getNumberEnvironmentVariable,
  constructRequestUrl,
} from "./utils.js";

// To avoid problems in which TypeScript does not import a declaration file,
// all Graphile Config types should be defined in a single place: index.ts.
declare global {
  namespace GraphileConfig {
    interface Plugin {
      example?: {
        middleware?: MiddlewareHandlers<ExampleMiddleware>;
      };
    }

    interface Preset {
      example?: GraphileConfig.ExampleOptions;
      openWeather?: OpenWeatherOptions;
    }

    interface ExampleOptions {
      port?: number | undefined;
    }

    interface OpenWeatherOptions {
      apiKey?: string | undefined;
    }
  }
}

export async function run(preset: GraphileConfig.Preset) {
  const resolvedPreset = resolvePreset(preset);
  const middleware = getExampleMiddleware(resolvedPreset);
  const { example: { port = getDefaultPort() } = {} } = resolvedPreset;

  const server = getServer(resolvedPreset, middleware);
  return new Promise<void>((resolve) => {
    server.listen(port, () => {
      console.log(`Server is listening on port ${String(port)}`);
      resolve();
    });
  });
}

function getExampleMiddleware(resolvedPreset: GraphileConfig.ResolvedPreset) {
  const middleware = new Middleware<ExampleMiddleware>();
  orderedApply(
    resolvedPreset.plugins,
    (plugin) => plugin.example?.middleware,
    (name, middlewareFunction) => {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-explicit-any
      middleware.register(name, middlewareFunction as any);
    },
  );
  return middleware;
}

// The use of Zod and Node's `http` are not related to Graphile Config. We use them
// simply to demonstrate how one might use Graphile Config in a project that runs
// an HTTP server.
//
// If you are creating a larger project, you may choose to use a more sophisticated
// HTTP server library like [Koa](https://koajs.com/) or
// [Express](https://expressjs.com/).

const CURRENT_TEMPERATURE_SEARCH_PARAM_SCHEMA = z.object({
  lat: z.coerce.number().finite(),
  lon: z.coerce.number().finite(),
});

const getServer = (
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

function getDefaultPort() {
  return getNumberEnvironmentVariable("PORT") ?? 4000;
}
