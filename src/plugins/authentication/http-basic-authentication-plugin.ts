import type { GraphileConfig } from "graphile-config";
import {
  AUTHENTICATED_CALLER_PROPERTY,
  AUTHENTICATION_FEATURE_LABEL,
} from "./constants.js";

export const BasicHttpAuthenticationPlugin: GraphileConfig.Plugin = {
  name: "BasicHttpAuthenticationPlugin",
  provides: [AUTHENTICATION_FEATURE_LABEL],
  example: {
    middleware: {
      handleRequest: (next, event) => {
        const adminCredentials =
          event.context.resolvedPreset.example
            ?.basicHttpAuthenticationAdminCredentials;

        // In this example, we just won't perform any authentication
        // if the admin credentials are not set. In a real project,
        // we would want to give plugins a hook into the preset coalescing
        // process to enforce that required options are set.
        if (adminCredentials) {
          const authHeader = event.request.headers.authorization;
          if (!authHeader) {
            next();
            return;
          }

          const parsedAuthHeader = parseBasicAuthHeader(authHeader);
          if (
            parsedAuthHeader !== "invalid" &&
            parsedAuthHeader.username === adminCredentials.username &&
            parsedAuthHeader.password === adminCredentials.password
          ) {
            event[AUTHENTICATED_CALLER_PROPERTY] = {
              type: "BASIC_HTTP_AUTHENTICATION_ADMIN",
              username: adminCredentials.username,
            };
          }
        }

        next();
      },
    },
  },
};

const parseBasicAuthHeader = (
  authHeader: string,
): "invalid" | { username: string; password: string } => {
  if (!authHeader.startsWith("Basic ")) {
    return "invalid";
  }
  const splitAuthHeader = authHeader.split(" ");
  if (splitAuthHeader.length !== 2) {
    return "invalid";
  }
  const decodedCredentials = Buffer.from(splitAuthHeader[1] ?? "", "base64")
    .toString()
    .split(":");
  if (!decodedCredentials[0] || !decodedCredentials[1]) {
    return "invalid";
  }
  return { username: decodedCredentials[0], password: decodedCredentials[1] };
};
