import type { GraphileConfig } from "graphile-config";
import { getNumberEnvironmentVariable } from "../env-utils.js";

export const coalesceExampleOptionsWithDefaults = (
  exampleOptions?: GraphileConfig.ExampleOptions,
): GraphileConfig.CoalescedExampleOptions => {
  return {
    ...exampleOptions,
    port: exampleOptions?.port ?? getNumberEnvironmentVariable("PORT") ?? 4000,
  };
};
