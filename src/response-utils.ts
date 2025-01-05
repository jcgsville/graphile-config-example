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
