# AXIVO

Website design powered by [Hugo](https://gohugo.io) and [Hextra](https://github.com/imfing/hextra) theme.

## Quick Start

Install the dependencies:

```shell
brew install hugo golang
```

Launch the server:

```shell
hugo server --buildDrafts --disableFastRender
```

## Theme Update

Run the following commands:

```shell
cd docs
hugo mod get -u github.com/imfing/hextra
hugo mod tidy
```

For `main` branch update, run:

```shell
hugo mod get -u github.com/imfing/hextra@main
```

See [Update modules](https://gohugo.io/hugo-modules/use-modules/#update-modules) for more details.
