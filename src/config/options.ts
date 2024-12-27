// import type { GraphileConfig } from 'graphile-config'
// import { getNumberEnvironmentVariable } from '../env-utils.js'
import { z } from 'zod'
import { getNumberEnvironmentVariable } from '../env-utils.js'

declare global {
    namespace GraphileConfig {
        interface ExampleOptions {
            port?: number | undefined
        }

        interface CoalescedExampleOptions extends ExampleOptions {
            port: number
        }
    }
}

export const coalescedExampleOptionsValidationSchema = z
    .object({
        example: z
            .object({
                port: z.number().finite(),
            })
            .passthrough(),
    })
    .passthrough()

export const coalesceExampleOptionsWithDefaults = (
    preset: GraphileConfig.Preset,
): void => {
    const defaultPort = getNumberEnvironmentVariable('PORT') ?? 4000

    if (!preset.example) {
        preset.example = {
            port: defaultPort,
        }
    } else {
        preset.example.port = preset.example.port ?? defaultPort
    }
}
