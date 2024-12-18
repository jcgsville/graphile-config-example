import { run } from './run.js'

run().catch((error) => {
    console.error(error)
    process.exit(1)
})
