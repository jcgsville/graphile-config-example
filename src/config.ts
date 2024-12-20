import type { GraphileConfig } from 'graphile-config'

import {
    coalesceOpenWeatherOptionsWithDefaults,
    type CoalescedOpenWeatherOptions,
} from './open-weather/config.js'

type GraphileConfigScopes = 'example' | 'openWeather'

export type CoalescedPreset = Omit<
    GraphileConfig.Preset,
    GraphileConfigScopes
> & {
    example: CoalescedExampleOptions
    openWeather: CoalescedOpenWeatherOptions
}

export const coalescePresetWithDefaults = (
    preset: GraphileConfig.Preset,
): CoalescedPreset => {
    return {
        ...preset,
        example: coalesceExampleOptionsWithDefaults(preset.example),
        openWeather: coalesceOpenWeatherOptionsWithDefaults(preset.openWeather),
    }
}

declare global {
    namespace GraphileConfig {
        interface ExampleOptions {
            port?: number | null | undefined
        }

        interface Preset {
            example?: ExampleOptions
        }
    }
}

export type CoalescedExampleOptions = {
    port: number
}

const coalesceExampleOptionsWithDefaults = (
    exampleOptions?: GraphileConfig.ExampleOptions,
): CoalescedExampleOptions => {
    return {
        port: exampleOptions?.port ?? 3000,
    }
}
