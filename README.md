# Node Module Template

A GitHub template repo for node modules

<!--
[![npm version](https://img.shields.io/npm/v/@voxpelli/node-module-template.svg?style=flat)](https://www.npmjs.com/package/@voxpelli/node-module-template)
[![npm downloads](https://img.shields.io/npm/dm/@voxpelli/node-module-template.svg?style=flat)](https://www.npmjs.com/package/@voxpelli/node-module-template)
-->
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-7fffff?style=flat&labelColor=ff80ff)](https://github.com/neostandard/neostandard)
[![Module type: ESM](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![Types in JS](https://img.shields.io/badge/types_in_js-yes-brightgreen)](https://github.com/voxpelli/types-in-js)
[![Follow @voxpelli@mastodon.social](https://img.shields.io/mastodon/follow/109247025527949675?domain=https%3A%2F%2Fmastodon.social&style=social)](https://mastodon.social/@voxpelli)

## Usage

```javascript
import { something } from '@voxpelli/node-module-template';

// Use that something
```

## API

### something()

Takes a value (`input`), does something configured by the config (`configParam`) and returns the processed value asyncly(`output`)

#### Syntax

```ts
something(input, [options]) => Promise<true>
```

#### Arguments

* `input` – _`string`_ – the input of the method
* `options` – _[`SomethingOptions`](#somethingoptions)_ – optional options

#### SomethingOptions

* `maxAge` – _`number`_ – the maximum age of latest release to include
* `minDownloadsLastMonth = 400` – _`number`_ – the minimum amount of downloads needed to be returned
* `skipPkg` – _`boolean`_ – when set skips resolving `package.json`

#### Returns

A `Promise` that resolves to `true`

## Used by

* [`example`](https://example.com/) – used by this one to do X and Y

## Similar modules

* [`example`](https://example.com/) – is similar in this way

## See also

* [Announcement blog post](#)
* [Announcement tweet](#)
