import type { GraphileConfig } from 'graphile-config'

import {
    coalesceOpenWeatherOptionsWithDefaults,
    type CoalescedOpenWeatherOptions,
} from '../open-weather/config.js'
import {
    coalesceExampleOptionsWithDefaults,
    type CoalescedExampleOptions,
} from './options.js'

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
        interface Preset {
            example?: ExampleOptions
        }
    }
}
