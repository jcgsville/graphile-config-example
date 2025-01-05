import type { GraphileConfig } from "graphile-config";
import { getNumberEnvironmentVariable } from "../env-utils.js";
import { CoalescedExampleOptions } from "../interfaces.js";

export const coalesceExampleOptionsWithDefaults = (
  exampleOptions?: GraphileConfig.ExampleOptions,
): CoalescedExampleOptions => {
  return {
    ...exampleOptions,
    port: exampleOptions?.port ?? getNumberEnvironmentVariable("PORT") ?? 4000,
  };
};
