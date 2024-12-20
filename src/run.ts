import type { Object } from 'ts-toolbelt'
import type { GraphileConfig } from 'graphile-config'
import { getServer } from './server.js'

export const run = async (preset: GraphileConfig.Preset): Promise<void> => {
    const coalescedOptions = coalesceOptionsWithDefaults(preset)

    const server = getServer()
    return new Promise((resolve) => {
        server.listen(coalescedOptions.port, () => {
            console.log(`Server is listening on port ${coalescedOptions.port}`)
            resolve()
        })
    })
}

type CoalescedPreset = Object.Required<GraphileConfig.ExampleOptions, 'port'>

const coalesceOptionsWithDefaults = (
    preset: GraphileConfig.Preset,
): CoalescedPreset => {
    return {
        port: preset.example?.port ?? 3000,
    }
}
