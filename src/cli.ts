import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { loadConfig } from 'graphile-config/load'
import { resolvePreset } from 'graphile-config'

import { run } from './run.js'

const argv = yargs(hideBin(process.argv))
    .option('config', {
        alias: 'C',
        description: 'The path to the config file',
        normalize: true,
    })
    .string('config')
    .option('port', {
        alias: 'P',
        description: 'The port on which the server will listen',
        normalize: true,
        type: 'number',
    })
    .number('port')
    .strict(true)
    .parseSync()

const main = async (): Promise<void> => {
    const userPreset = await loadConfig(argv.config)
    const argvPreset = extendUserPresetWithArgv(userPreset)
    const resolvedPreset = resolvePreset(argvPreset)

    await run(resolvedPreset)
}

const extendUserPresetWithArgv = (
    userPreset: GraphileConfig.Preset | null,
): GraphileConfig.Preset => ({
    extends: userPreset ? [userPreset] : [],
    example: {
        port: argv.port ?? userPreset?.example?.port,
    },
})

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
