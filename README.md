# AXIVO

Website design powered by [Hugo](https://gohugo.io) and [Hextra](https://github.com/imfing/hextra) theme.

## Quick Start

Install the dependencies:

```shell
brew install hugo golang
```

Launch the server:

```shell
hugo server --disableFastRender -Ds ./docs
```

## Local Development

For local development and testing, use the following commands:

```shell
# Run the Hugo server with live reloading
hugo server --disableFastRender -Ds docs

# Generate static site
hugo -s ./docs

# If you need to manually update modules for local testing
hugo mod clean --all
hugo mod get -u ./...
hugo mod tidy -s claude
hugo mod tidy -s docs
hugo mod tidy -s k3s-cluster

# For Hextra main branch update (local testing only)
hugo mod get -u github.com/imfing/hextra@main
```

## Dependency Management

This project uses [Renovate](https://github.com/renovatebot/renovate) to automatically manage dependencies, including Hugo modules and the Hextra theme. Renovate will create pull requests when new versions are available.

The module update commands above are typically only needed for local testing, as Renovate handles dependency updates in pull requests automatically.

If you need to examine the current module configuration, you can use:

```shell
hugo mod graph
```

See the [Hugo modules documentation](https://gohugo.io/hugo-modules/) for more details about working with Hugo modules.
