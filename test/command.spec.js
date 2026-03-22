/* eslint-disable security/detect-non-literal-fs-filename */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { Readable } from 'node:stream';

import { command } from '../lib/command.js';
import { InputError } from '../lib/utils/errors.js';

/**
 * @param {string} name
 * @returns {URL}
 */
const fixture = (name) => new URL(`fixtures/${name}`, import.meta.url);

const inputStream = () => createReadStream(fixture('input.txt'));

describe('command()', () => {
  it('should accept the input', async () => {
    const result = await command(
      [],
      inputStream()
    );

    assert.deepEqual(result, {
      mainInput: await readFile(fixture('input.txt'), 'utf8'),
      outputJson: false,
      outputMarkdown: false,
    });
  });

  it('should accept markdown flag', async () => {
    const result = await command(
      ['--markdown'],
      inputStream()
    );

    assert.equal(result.outputMarkdown, true);
  });

  it('should accept json flag', async () => {
    const result = await command(
      ['--json'],
      inputStream()
    );

    assert.equal(result.outputJson, true);
  });

  it('should reject positional arguments', async () => {
    await assert.rejects(
      () => command(['unexpected'], inputStream()),
      (/** @type {unknown} */ err) => err instanceof InputError && err.message.includes('Positional')
    );
  });

  it('should reject empty input', async () => {
    const empty = /** @type {import('node:fs').ReadStream} */ (Readable.from(''));
    await assert.rejects(
      () => command([], empty),
      (/** @type {unknown} */ err) => err instanceof InputError && err.message === 'Empty input'
    );
  });

  it('should reject --json and --markdown used together', async () => {
    await assert.rejects(
      () => command(['--json', '--markdown'], inputStream()),
      (/** @type {unknown} */ err) => err instanceof InputError && err.message.includes('mutually exclusive')
    );
  });
});
