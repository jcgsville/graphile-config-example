# Graphile Config Example

An example project demonstrating how Node.js library authors can use
[Graphile Config](https://star.graphile.org/graphile-config/) to make their
libraries configurable and extensible.

The goal of this project is to strike a balance between - 1 - being somewhat
realistic to show how Graphile Config might actually be used and - 2 - not
adding too much that distracts from the use of Graphile Config.

The library runs an HTTP server with a single REST endpoint:
`GET /current-temperature`. That endpoint fetches the current temperature from
the [OpenWeather API](https://openweathermap.org/api).

## Using the example project

To run the server, you need to create a free API key for
[OpenWeather](https://openweathermap.org/api). The OpenWeather API key can be
set in the preset option `openWeather.apiKey` or via the `OPEN_WEATHER_API_KEY`
environment variable.

Inspired by Graphile projects like [Postgraphile](https://postgraphile.org/) &
[Graphile Worker](https://worker.graphile.org/), this project could be used in
"CLI mode" or "library mode".

### CLI Mode

If this was published to npm, users might run this with npx:

```sh
npx graphile-config-example --help
```

Alternatively, users could run the CLI after installing it in their local
Node.js project:

```sh
npm install graphile-config-example
./node_modules/.bin/graphile-config-example --help
```

The example project contains two CLI arguments:

- `--config/-C` accepts a path to a Graphile Config preset.
- `--port/-P` allows users to set the port at which the http server listens for
  requests.

### Library Mode

The `graphile-config-example` package exposes a `run()` function which users
could use to incorporate the server into their existing Node.js processes.

## Configuration Options

This project demonstrates different patterns for configuration with Graphile
Config. Options can be set via following sources, in order of highest to lowest
priority:

- CLI arguments
- User-provided Presets
- Environment Variables
- Library-provided Defaults

Depending on the source, options are combined via
[preset composition](https://star.graphile.org/graphile-config/preset#preset-composition)
or via the nullish coalescing operator (`??`).

### Configuration Scopes

This project's presets contain two scopes for configuration: `example` and
`openWeather`. The OpenWeather API key is in its own scope as a gesture towards
how you might create a scope to consolidate and share options related to a
dependency. This is similar to how several Graphile projects use a common
`pgServices` scope.

## Declaration Merging

This project and Graphile Config make heavy use of TypeScript declaration
merging to allow multiple modules to contribute to the shared types `Preset`,
`ExampleOptions`, `CoalescedExampleOptions`, etc.

```ts
declare global {
    namespace GraphileConfig {
        // ...
    }
}
```

## Extending via Plugins

This project demonstrates how library authors can use Graphile Config plugins to
make their library extensible. This project declares (TODO: right word?) a
single middleware action: `handleRequest` in the `example` scope.

The
[`BasicHttpAuthenticationPlugin`](./src/plugins/authentication/http-basic-authentication-plugin.ts)
and the
[`EnforceAuthenticationPlugin`](./src/plugins/authentication/enforce-authentication-plugin.ts)
add authentication logic that is run on every request. They also demonstrate of
`before`/`after`/`provides` can be used to control the order that plugins and
middleware are registered and executed.

## Exported Presets

Libraries may export presets that contain sets of plugins that are often used
together. This project exports a
[`BasicAuthenticationPreset`](./src/config/presets/basic-authentication-preset.ts)
for use by theoretical users that want to enable and enforce authentication.

## Contributing

Contributions to documentation and code are welcome. For large changes, please
open an issue to discuss the change before submitting a PR.

The code in the project is heavily commented to help readers understand the
"why" behind the usage of Graphile Config.

### Installation

This project was built with node v22.x and npm v10.9.x. Run `npm install` to
install the project's dependencies.

### Running Locally

The simplest way to run test any code is to build the project and run the built
CLI.

```sh
npm run clean-built-artifacts && npm run build && npm run start:cli -- -h
```

### Linting

This project uses `eslint` and `prettier`. Please lint and format your code
before opening a PR:

```sh
npm run lint:fix
npm run fmt
```

If you use VS Code or editors based on VS Code, you can install the
[recommended extensions](./.vscode/extensions.json) to get linting and
formatting in your editor.

## TODO

- Move away from legacy eslint config
- Add an option to preset that is nullable - communicating to use that option
  can be disabled.
- Look into the typing of Graphile Config's `orderedApply()` and related
  middleware types to remove the `as any` cast in
  [`middleware.ts`](./src/config/middleware.ts)
- Add non-middleware functionality.
- Actually publish the library to npm
- Explore a way to make option coalescing extensible.
