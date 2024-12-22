import type { MiddlewareHandlers } from 'graphile-config'
import type { ExampleMiddleware } from './middleware.js'

declare global {
    namespace GraphileConfig {
        interface Plugin {
            example?: {
                middleware?: MiddlewareHandlers<ExampleMiddleware>
            }
        }
    }
}
