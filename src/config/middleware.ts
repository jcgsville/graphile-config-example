import http from 'node:http'
import { Middleware, orderedApply } from 'graphile-config'

import type { CoalescedExampleOptions } from './options.js'
import type { CoalescedOpenWeatherOptions } from '../open-weather/config.js'
import type { CoalescedPreset } from './preset.js'

export interface MiddlewareContext {
    example: CoalescedExampleOptions
    openWeather: CoalescedOpenWeatherOptions
}

export type HandleRequestMiddlewareEvent = {
    context: MiddlewareContext
    request: http.IncomingMessage
    response: http.ServerResponse
} & Record<string, unknown>

export interface ExampleMiddleware {
    handleRequest(event: HandleRequestMiddlewareEvent): void
}

export const getExampleMiddleware = (
    coalescedPreset: CoalescedPreset,
): Middleware<ExampleMiddleware> => {
    const middleware = new Middleware<ExampleMiddleware>()
    orderedApply(
        coalescedPreset.plugins,
        (plugin) => plugin.example?.middleware,
        (name, middlewareFunction) => {
            // TODO: fix this type error
            middleware.register(name, middlewareFunction)
        },
    )

    return middleware
}
