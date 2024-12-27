import type { GraphileConfig } from 'graphile-config'
import {
    AUTHENTICATED_CALLER_PROPERTY,
    AUTHENTICATION_FEATURE_LABEL,
} from './constants.js'

declare global {
    namespace GraphileConfig {
        interface ExampleOptions {
            basicHttpAuthenticationAdminCredentials?:
                | {
                      username: string
                      password: string
                  }
                | undefined
        }

        interface CoalescedExampleOptions extends ExampleOptions {
            basicHttpAuthenticationAdminCredentials: {
                username: string
                password: string
            }
        }
    }
}

/**
 * This feature label is not used by any other plugins in this library, but
 * setting it allows other 3rd party plugin creators to ensure their plugin's
 * middleware are run before or after this plugin's middleware.
 */
export const HTTP_BASIC_AUTHENTICATION_FEATURE_LABEL =
    'http-basic-authentication'

/**
 * A simple plugin that checks for HTTP Basic Authentication credentials in the
 * request headers and compares them to static admin credentials provided in the
 * preset.
 *
 * Though it is somewhat common practice, you should do authentication like
 * this! It is just a simple example to illustrate Graphile Config middleware.
 */
export const BasicHttpAuthenticationPlugin: GraphileConfig.Plugin = {
    name: 'BasicHttpAuthenticationPlugin',
    provides: [
        AUTHENTICATION_FEATURE_LABEL,
        HTTP_BASIC_AUTHENTICATION_FEATURE_LABEL,
    ],
    example: {
        middleware: {
            handleRequest: (next, event) => {
                const adminCredentials =
                    event.context.coalescedPreset.example
                        .basicHttpAuthenticationAdminCredentials

                const authHeader = event.request.headers.authorization
                if (!authHeader) {
                    next()
                    return
                }

                const parsedAuthHeader = parseBasicAuthHeader(authHeader)
                if (
                    parsedAuthHeader !== 'invalid' &&
                    parsedAuthHeader.username === adminCredentials.username &&
                    parsedAuthHeader.password === adminCredentials.password
                ) {
                    event[AUTHENTICATED_CALLER_PROPERTY] = {
                        type: 'BASIC_HTTP_AUTHENTICATION_ADMIN',
                        username: adminCredentials.username,
                    }
                }

                next()
            },
        },
    },
}

const parseBasicAuthHeader = (
    authHeader: string,
): 'invalid' | { username: string; password: string } => {
    if (!authHeader.startsWith('Basic ')) {
        return 'invalid'
    }
    const splitAuthHeader = authHeader.split(' ')
    if (splitAuthHeader.length !== 2) {
        return 'invalid'
    }
    const decodedCredentials = Buffer.from(splitAuthHeader[1] ?? '', 'base64')
        .toString()
        .split(':')
    if (!decodedCredentials[0] || !decodedCredentials[1]) {
        return 'invalid'
    }
    return { username: decodedCredentials[0], password: decodedCredentials[1] }
}
