import type { GraphileConfig } from 'graphile-config'

import { respondWithUnauthorized } from '../../response-utils.js'
import {
    AUTHENTICATED_CALLER_PROPERTY,
    AUTHENTICATION_FEATURE_LABEL,
} from './constants.js'

/**
 * By separating the enforcement of authentication from the authentication plugin,
 * we allow users of this library to add multiple authentication plugin that
 * `provides` the `AUTHENTICATION_FEATURE_LABEL`. Each authentication plugin
 * can check for a different authentication method, and rely on the
 * `EnforceAuthenticationPlugin` to enforce that one of the authentication plugins
 * successfully authenticated the request.
 */
export const EnforceAuthenticationPlugin: GraphileConfig.Plugin = {
    name: 'EnforceAuthenticationPlugin',
    // This ensures that this plugin's middleware is run after any authentication
    // plugins' middleware have run.
    after: [AUTHENTICATION_FEATURE_LABEL],
    example: {
        middleware: {
            handleRequest: (next, event) => {
                if (event[AUTHENTICATED_CALLER_PROPERTY]) {
                    next()
                    return
                }

                respondWithUnauthorized(event.response)
                event.response.end()
            },
        },
    },
}
