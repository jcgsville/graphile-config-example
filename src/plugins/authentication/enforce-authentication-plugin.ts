import type { GraphileConfig } from 'graphile-config'

import { respondWithUnauthorized } from '../../response-utils.js'
import {
    AUTHENTICATED_CALLER_PROPERTY,
    AUTHENTICATION_FEATURE_LABEL,
} from './constants.js'

export const EnforceAuthenticationPlugin: GraphileConfig.Plugin = {
    name: 'EnforceAuthenticationPlugin',
    after: [AUTHENTICATION_FEATURE_LABEL],
    example: {
        middleware: {
            handleRequest: (next, event) => {
                const authenticatedCaller = event[AUTHENTICATED_CALLER_PROPERTY]
                if (authenticatedCaller) {
                    next()
                    return
                }

                respondWithUnauthorized(event.response)
                event.response.end()
            },
        },
    },
}
