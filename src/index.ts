/**
 * These are the public exports for this library available by importing/requiring:
 *
 * `import { run } from 'graphile-config-example'`
 */

import {
  Middleware,
  GraphileConfig,
  orderedApply,
  MiddlewareHandlers,
  resolvePreset,
} from "graphile-config";

import { getDefaultPort, getServer } from "./get-server.js";
import { ExampleMiddleware } from "./interfaces.js";

export { BasicAuthenticationPreset } from "./config/presets/basic-authentication-preset.js";

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

    // Plugins can add options to scopes via declaration merging.
    // Right now, this project does not have a good way for plugins
    // to add to the coalescing functionality. So plugin options
    // need to be checked and validated in the middleware that relies
    // on them. See `if (adminCredentials)` in
    // `src/plugins/authentication/http-basic-authentication-plugin.ts`.
    interface ExampleOptions {
      basicHttpAuthenticationAdminCredentials?:
        | {
            username: string;
            password: string;
          }
        // A user can set basicHttpAuthenticationAdminCredentials to
        // undefined or null to opt out of authentication.
        | undefined
        | null;

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
