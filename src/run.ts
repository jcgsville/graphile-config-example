import type { GraphileConfig } from 'graphile-config'

import { getServer } from './server.js'
import { coalescePresetWithDefaults } from './config.js'

export const run = async (preset: GraphileConfig.Preset): Promise<void> => {
    const coalescedPreset = coalescePresetWithDefaults(preset)

    const server = getServer(coalescedPreset)
    return new Promise((resolve) => {
        server.listen(coalescedPreset.example.port, () => {
            console.log(
                `Server is listening on port ${coalescedPreset.example.port}`,
            )
            resolve()
        })
    })
}
