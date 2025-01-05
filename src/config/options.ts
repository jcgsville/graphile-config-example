import type { GraphileConfig } from "graphile-config";
import { getNumberEnvironmentVariable } from "../env-utils.js";

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

export const coalesceExampleOptionsWithDefaults = (
  exampleOptions?: GraphileConfig.ExampleOptions,
): GraphileConfig.CoalescedExampleOptions => {
  return {
    ...exampleOptions,
    port: exampleOptions?.port ?? getNumberEnvironmentVariable("PORT") ?? 4000,
  };
};
