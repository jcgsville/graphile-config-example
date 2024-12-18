import { getServer } from './server.js'

export const run = async (): Promise<void> => {
    const server = getServer()
    return new Promise((resolve) => {
        server.listen(3000, () => {
            resolve()
        })
    })
}
