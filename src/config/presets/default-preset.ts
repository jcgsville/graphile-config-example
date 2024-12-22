import { EnforceAuthenticationPlugin } from '../plugins/authentication/enforce-authentication-plugin.js'
import { BasicHttpAuthenticationPlugin } from '../plugins/authentication/http-basic-authentication-plugin.js'

export const DefaultPreset: GraphileConfig.Preset = {
    plugins: [BasicHttpAuthenticationPlugin, EnforceAuthenticationPlugin],
}
