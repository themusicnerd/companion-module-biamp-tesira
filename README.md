# companion-module-biamp-tesira

Companion v3 module for Biamp Tesira systems using the Tesira Text Protocol.

This local v3 rewrite keeps the upstream module identity while modernising the implementation around:

- dual Tesira telnet sessions for control and recurring GET polling
- tracked subscriptions with automatic re-subscribe after reconnect
- dynamic variables for subscription and polling values, including indexed array members
- user-friendly helper actions for level, mute, presets, alias discovery, generic commands, subscriptions, and polling
- discovered starter presets for level blocks, source routers/selectors, and meters
- selector source-name overrides and per-output router discovery presets
- three meter-oriented advanced feedbacks:
  - VU meter: vertical, bottom-to-top, multi-colour
  - Gain reduction meter: vertical, top-to-bottom, red
  - Level meter: horizontal, left-to-right

The subscription helper templates were built from the Biamp Tesira Text Protocol subscription matrix and cover the documented subscription-capable block and attribute pairs from the Biamp support articles.

See [HELP.md](./companion/HELP.md) for operator-facing usage notes.

## Development

Install dependencies:

```bash
yarn install
```

Build once:

```bash
yarn build
```

Lint the source:

```bash
yarn lint:raw src
```
