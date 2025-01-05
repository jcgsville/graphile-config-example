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
} from "graphile-config";

import { getServer } from "./get-server.js";
import { coalescePresetWithDefaults } from "./config/preset.js";
import { ExampleMiddleware } from "./interfaces.js";

export { BasicAuthenticationPreset } from "./config/presets/basic-authentication-preset.js";

declare global {
  namespace GraphileConfig {
    interface Preset {
      example?: GraphileConfig.ExampleOptions;
    }

    interface CoalescedPreset extends Preset {
      example: GraphileConfig.CoalescedExampleOptions;
    }
  }
}

declare global {
  namespace GraphileConfig {
    // Plugins can add options to scopes via declaration merging.
    // Right now, this project does not have a good way for plugins
    // to add to the coalescing functionality. So plugin options
    // need to be checked and validated in the middleware that relies
    // on them. See `if (adminCredentials)` below.
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
    }
  }
}

declare global {
  namespace GraphileConfig {
    interface OpenWeatherOptions {
      apiKey?: string | undefined;
    }

    interface CoalescedOpenWeatherOptions {
      apiKey: string;
    }

    interface Preset {
      openWeather?: OpenWeatherOptions;
    }

    interface CoalescedPreset extends Preset {
      openWeather: CoalescedOpenWeatherOptions;
    }
  }
}

declare global {
  namespace GraphileConfig {
    interface ExampleOptions {
      port?: number | undefined;
    }

    interface CoalescedExampleOptions extends ExampleOptions {
      port: number;
    }
  }
}

declare global {
  namespace GraphileConfig {
    interface Plugin {
      example?: {
        middleware?: MiddlewareHandlers<ExampleMiddleware>;
      };
    }
  }
}

export async function run(preset: GraphileConfig.Preset) {
  const coalescedPreset = coalescePresetWithDefaults(preset);
  const middleware = getExampleMiddleware(coalescedPreset);

  const server = getServer(coalescedPreset, middleware);
  return new Promise<void>((resolve) => {
    server.listen(coalescedPreset.example.port, () => {
      console.log(
        `Server is listening on port ${String(coalescedPreset.example.port)}`,
      );
      resolve();
    });
  });
}

function getExampleMiddleware(coalescedPreset: GraphileConfig.CoalescedPreset) {
  const middleware = new Middleware<ExampleMiddleware>();
  orderedApply(
    coalescedPreset.plugins,
    (plugin) => plugin.example?.middleware,
    (name, middlewareFunction) => {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-explicit-any
      middleware.register(name, middlewareFunction as any);
    },
  );
  return middleware;
}
