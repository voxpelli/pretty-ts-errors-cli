# Pretty TS Errors CLI

CLI helper for [`@pretty-ts-errors/formatter`](https://www.npmjs.com/package/@pretty-ts-errors/formatter)

[![npm version](https://img.shields.io/npm/v/@voxpelli/pretty-ts-errors-cli.svg?style=flat)](https://www.npmjs.com/package/@voxpelli/pretty-ts-errors-cli)
[![npm downloads](https://img.shields.io/npm/dm/@voxpelli/pretty-ts-errors-cli.svg?style=flat)](https://www.npmjs.com/package/@voxpelli/pretty-ts-errors-cli)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-7fffff?style=flat&labelColor=ff80ff)](https://github.com/neostandard/neostandard)
[![Module type: ESM](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![Types in JS](https://img.shields.io/badge/types_in_js-yes-brightgreen)](https://github.com/voxpelli/types-in-js)
[![Follow @voxpelli@mastodon.social](https://img.shields.io/mastodon/follow/109247025527949675?domain=https%3A%2F%2Fmastodon.social&style=social)](https://mastodon.social/@voxpelli)

## Install

### Globally

```sh
npm install -g @voxpelli/pretty-ts-errors-cli
```

### Locally

```sh
npm install -D @voxpelli/pretty-ts-errors-cli
```

## Usage

### Basic usage

Terminal output:

```sh
cat examples/input.txt | pretty-ts-errors
```

Markdown output:

```sh
cat examples/input.txt | pretty-ts-errors -m
```

### Watch mode

Use with `tsc --watch` to format errors in real-time:

```sh
tsc --watch --pretty | pretty-ts-errors --watch
```

Or with a one-time compile:

```sh
tsc --pretty 2>&1 | pretty-ts-errors --watch
```

**Note:** The `--pretty` flag is recommended when using tsc to get detailed error output.

## Example output

> Type `typeof import("/home/runner/work/neostandard/neostandard/node_modules/@stylistic/eslint-plugin/dist/dts/index")` is not assignable to type `Plugin`.
>   Types of property `configs` are incompatible.
>     Type:
> ```ts
> {
>   "disable-legacy": Config<RulesRecord>;
>   customize: {
>     (options: StylisticCustomizeOptions<false>): BaseConfig<
>       RulesRecord,
>       RulesRecord
>     >;
>     (
>       options?:
>         | StylisticCustomizeOptions<...>
>         | undefined
>     ): Config<...>;
>   };
>   /* 4 more */;
>   "recommended-legacy": BaseConfig<...>;
> }
> ```
>
>  is not assignable to type:
> ```ts
> Record<
>   string,
>   | Config<RulesRecord>
>   | LegacyConfig<RulesRecord, RulesRecord>
>   | Config<RulesRecord>[]
> >
> ```
>
> .
>       Property `'customize'` is incompatible with index signature.
>         Type:
> ```ts
> {
>   (options: StylisticCustomizeOptions<false>): BaseConfig<
>     RulesRecord,
>     RulesRecord
>   >;
>   (
>     options?: StylisticCustomizeOptions<true> | undefined
>   ): Config<...>;
> }
> ```
>
>  is not assignable to type:
> ```ts
> | Config<RulesRecord>
>   | LegacyConfig<RulesRecord, RulesRecord>
>   | Config<RulesRecord>[]
> ```
>
> .
>
> _Generated using [`@voxpelli/pretty-ts-errors-cli`](https://github.com/voxpelli/pretty-ts-errors-cli)_


<!-- ## Used by

* [`example`](https://example.com/) – used by this one to do X and Y

## Similar modules

* [`example`](https://example.com/) – is similar in this way

## See also

* [Announcement blog post](#)
* [Announcement tweet](#) -->
