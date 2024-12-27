import http from 'node:http'
import { Middleware, orderedApply } from 'graphile-config'
import { z } from 'zod'

export interface CoalescePresetMiddlewareEvent {
    coalescedPresetValidationSchemas: z.ZodSchema[]
    preset: GraphileConfig.Preset
}

export interface CoalescePresetMiddlewareResponse {
    coalescedPresetValidationSchemas: z.ZodSchema[]
    partiallyCoalescedPreset: GraphileConfig.Preset
}

export interface MiddlewareContext {
    coalescedPreset: GraphileConfig.CoalescedPreset
}

/**
 * By extending `Record<string, unknown>`, we allow plugins to add additional
 * fields to the event object for use by other plugins. Those other plugins
 * cannot rely on Typescript to enforce that those fields are present, so they
 * should check for them explicitly before using them.
 */
export interface HandleRequestMiddlewareEvent extends Record<string, unknown> {
    context: MiddlewareContext
    request: http.IncomingMessage
    response: http.ServerResponse
}

export interface ExampleMiddleware {
    coalescePreset(
        event: CoalescePresetMiddlewareEvent,
    ): CoalescePresetMiddlewareResponse
    handleRequest(event: HandleRequestMiddlewareEvent): void
}

export const getExampleMiddleware = (
    plugins: GraphileConfig.Plugin[] | undefined,
): Middleware<ExampleMiddleware> => {
    const middleware = new Middleware<ExampleMiddleware>()
    orderedApply(
        plugins,
        (plugin) => plugin.example?.middleware,
        (name, middlewareFunction) => {
            // eslint-disable-next-line  @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-explicit-any
            middleware.register(name, middlewareFunction as any)
        },
    )

    return middleware
}
