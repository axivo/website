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

## Theme Update

Run the following commands:

```shell
hugo mod clean --all
hugo mod get -u ./...
hugo mod tidy ./...
```

For Hextra `main` branch update, run:

```shell
hugo mod get -u github.com/imfing/hextra@main
```

See the [modules update](https://gohugo.io/hugo-modules/use-modules/#update-modules) documentation, for more details.
