import type { GraphileConfig } from 'graphile-config'
import { getNumberEnvironmentVariable } from '../env-utils.js'

declare global {
    namespace GraphileConfig {
        interface ExampleOptions {
            port?: number | undefined
        }
    }
}

export type CoalescedExampleOptions = GraphileConfig.ExampleOptions & {
    port: number
}

export const coalesceExampleOptionsWithDefaults = (
    exampleOptions?: GraphileConfig.ExampleOptions,
): CoalescedExampleOptions => {
    return {
        ...exampleOptions,
        port:
            exampleOptions?.port ??
            getNumberEnvironmentVariable('PORT') ??
            4000,
    }
}
