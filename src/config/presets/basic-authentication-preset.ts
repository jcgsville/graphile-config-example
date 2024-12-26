import { EnforceAuthenticationPlugin } from '../../plugins/authentication/enforce-authentication-plugin.js'
import { BasicHttpAuthenticationPlugin } from '../../plugins/authentication/http-basic-authentication-plugin.js'

export const BasicAuthenticationPreset: GraphileConfig.Preset = {
    plugins: [BasicHttpAuthenticationPlugin, EnforceAuthenticationPlugin],
}
