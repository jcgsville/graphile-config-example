import http from 'node:http'
import { z } from 'zod'

import type { CoalescedPreset } from './config.js'
import { getCurrentTemperatureKelvin } from './open-weather/sdk.js'

const CURRENT_TEMPERATURE_SEARCH_PARAM_SCHEMA = z.object({
    lat: z.coerce.number().finite(),
    lon: z.coerce.number().finite(),
})

export const getServer = (coalescedPreset: CoalescedPreset): http.Server =>
    http.createServer((req, res) => {
        const url = constructRequestUrl(req)
        if (!url) {
            respondWithInternalServerError(res)
            return
        }

        if (req.method === 'GET' && url.pathname === '/current-temperature') {
            handleCurrentTemperatureRequest(url, res, coalescedPreset)
            return
        }

        respondWithNotFound(res)
    })

const handleCurrentTemperatureRequest = (
    requestUrl: URL,
    response: http.ServerResponse,
    coalescedPreset: CoalescedPreset,
): void => {
    const parseResult = CURRENT_TEMPERATURE_SEARCH_PARAM_SCHEMA.safeParse(
        Object.fromEntries(requestUrl.searchParams),
    )

    if (parseResult.success) {
        getCurrentTemperatureKelvin(
            Number(parseResult.data.lat),
            Number(parseResult.data.lon),
            coalescedPreset.openWeather.apiKey,
        )
            .then((temperature) => {
                respondWithData(response, { temperatureKelvin: temperature })
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

const respondWithInternalServerError = (
    response: http.ServerResponse,
): void => {
    response.writeHead(500, { 'Content-Type': 'application/json' })
    response.end(
        JSON.stringify({ errorMessage: 'Something unexpected went wrong' }),
    )
}

const respondWithBadRequest = (
    response: http.ServerResponse,
    errorDetails: Record<string, unknown>,
): void => {
    response.writeHead(400, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ errorMessage: 'Bad Request', errorDetails }))
}

const respondWithNotFound = (response: http.ServerResponse): void => {
    response.writeHead(404)
    response.end()
}

const respondWithData = (
    response: http.ServerResponse,
    data: Record<string, unknown>,
): void => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(data))
}
