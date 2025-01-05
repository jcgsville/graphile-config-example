import { EnforceAuthenticationPlugin } from "../plugins/enforce-authentication-plugin.js";
import { BasicHttpAuthenticationPlugin } from "../plugins/http-basic-authentication-plugin.js";

/**
 * Library authors may bundle together and export commonly used plugins as a
 * preset. This simple preset bundles together two plugins that enforce basic
 * HTTP authentication.
 */
export const BasicAuthenticationPreset: GraphileConfig.Preset = {
  plugins: [BasicHttpAuthenticationPlugin, EnforceAuthenticationPlugin],
};
