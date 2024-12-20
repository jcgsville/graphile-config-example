export { run } from './run.js'

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
