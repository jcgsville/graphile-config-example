import { BasicAuthenticationPreset } from "./presets/basic-authentication-preset.js";

export default {
  extends: [BasicAuthenticationPreset],
  example: {
    port: 4321,
  },
} as GraphileConfig.Preset;
