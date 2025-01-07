import http from "node:http";

export const respondWithSuccess = (
  response: http.ServerResponse,
  data: Record<string, unknown>,
): void => {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
};

export const respondWithBadRequest = (
  response: http.ServerResponse,
  errorDetails: Record<string, unknown>,
): void => {
  response.writeHead(400, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ errorMessage: "Bad Request", errorDetails }));
};

export const respondWithUnauthorized = (
  response: http.ServerResponse,
): void => {
  response.writeHead(401);
  response.end();
};

export const respondWithNotFound = (response: http.ServerResponse): void => {
  response.writeHead(404);
  response.end();
};

export const respondWithInternalServerError = (
  response: http.ServerResponse,
): void => {
  response.writeHead(500, { "Content-Type": "application/json" });
  response.end(
    JSON.stringify({ errorMessage: "Something unexpected went wrong" }),
  );
};

export const constructRequestUrl = (
  request: http.IncomingMessage,
): URL | null => {
  if (request.url && request.headers.host) {
    return new URL(request.url, `http://${request.headers.host}`);
  }

  return null;
};

export const getNumberEnvironmentVariable = (
  environmentVariableName: string,
  rejectNaN = true,
): number | undefined => {
  const environmentVariable = process.env[environmentVariableName];
  const parsed = environmentVariable
    ? parseInt(environmentVariable, 10)
    : undefined;

  if (rejectNaN && parsed !== undefined && isNaN(parsed)) {
    throw new Error(
      `Environment variable is an invalid number: ${environmentVariableName}`,
    );
  }

  return parsed;
};

export const requireEnvironmentVariable = (
  variableName: string,
  errorMessage?: string,
): string => {
  const value = process.env[variableName];
  if (!value) {
    throw new Error(
      errorMessage ?? `Missing required environment variable: ${variableName}.`,
    );
  }
  return value;
};
