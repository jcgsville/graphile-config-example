import http from 'node:http'
import { z } from 'zod'

import type { CoalescedPreset } from './config/preset.js'
import { getCurrentTemperatureKelvin } from './open-weather/sdk.js'
import type { Middleware } from 'graphile-config'
import type {
    ExampleMiddleware,
    HandleRequestMiddlewareEvent,
} from './config/middleware.js'
import {
    respondWithBadRequest,
    respondWithData,
    respondWithInternalServerError,
    respondWithNotFound,
} from './response-utils.js'

const CURRENT_TEMPERATURE_SEARCH_PARAM_SCHEMA = z.object({
    lat: z.coerce.number().finite(),
    lon: z.coerce.number().finite(),
})

export const getServer = (
    coalescedPreset: CoalescedPreset,
    middleware: Middleware<ExampleMiddleware>,
): http.Server =>
    http.createServer((request, response) => {
        const event: HandleRequestMiddlewareEvent = {
            context: coalescedPreset,
            request,
            response,
        }

        middleware.runSync('handleRequest', event, ({ request, response }) => {
            const url = constructRequestUrl(request)
            if (!url) {
                respondWithInternalServerError(response)
                return
            }

            if (
                request.method === 'GET' &&
                url.pathname === '/current-temperature'
            ) {
                handleCurrentTemperatureRequest(coalescedPreset, url, response)
                return
            }

            respondWithNotFound(response)
        })
    })

const handleCurrentTemperatureRequest = (
    coalescedPreset: CoalescedPreset,
    requestUrl: URL,
    response: http.ServerResponse,
): void => {
    const parseResult = CURRENT_TEMPERATURE_SEARCH_PARAM_SCHEMA.safeParse(
        Object.fromEntries(requestUrl.searchParams),
    )

    if (parseResult.success) {
        getCurrentTemperatureKelvin(
            coalescedPreset.openWeather,
            Number(parseResult.data.lat),
            Number(parseResult.data.lon),
        )
            .then((temperatureKelvin) => {
                respondWithData(response, { temperatureKelvin })
            })
            .catch((error) => {
                console.error(error)
                respondWithInternalServerError(response)
            })
    } else {
        respondWithBadRequest(response, {
            queryParams: parseResult.error,
        })
    }
}

const constructRequestUrl = (request: http.IncomingMessage): URL | null => {
    if (request.url) {
        return new URL(request.url, `http://${request.headers.host}`)
    }

    return null
}
