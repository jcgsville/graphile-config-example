import type { GraphileConfig, Middleware } from 'graphile-config'

import { getServer } from './get-server.js'
import { coalescePresetWithDefaults } from './config/preset.js'
import {
    getExampleMiddleware,
    type ExampleMiddleware,
} from './config/middleware.js'
import {
    coalescedExampleOptionsValidationSchema,
    coalesceExampleOptionsWithDefaults,
} from './config/options.js'
import { getNumberEnvironmentVariable } from './env-utils.js'

export const run = async (preset: GraphileConfig.Preset): Promise<void> => {
    const middleware = getExampleMiddleware(preset.plugins)

    const foo = middleware.runSync(
        'coalescePreset',
        { coalescedPresetValidationSchemas: [], preset },
        coalescePresetUnderlyingAction,
    )

    const coalescedPreset = coalescePresetWithDefaults(preset)

    const server = getServer(coalescedPreset, middleware)
    return new Promise((resolve) => {
        server.listen(coalescedPreset.example.port, () => {
            console.log(
                `Server is listening on port ${String(coalescedPreset.example.port)}`,
            )
            resolve()
        })
    })
}

type CoalescePresetUnderlyingAction = Parameters<
    Middleware<Pick<ExampleMiddleware, 'coalescePreset'>>['runSync']
>[2]

const coalescePresetUnderlyingAction: CoalescePresetUnderlyingAction = ({
    coalescedPresetValidationSchemas,
    preset,
}) => {
    coalesceExampleOptionsWithDefaults(preset)
    coalescedPresetValidationSchemas.push(
        coalescedExampleOptionsValidationSchema,
    )

    return {
        coalescedPresetValidationSchemas,
        partiallyCoalescedPreset: preset,
    }
}
