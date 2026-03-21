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

describe('command()', () => {
  it('should accept the input', async () => {
    const result = await command(
      [],
      createReadStream(fixture('input.txt'))
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
      createReadStream(fixture('input.txt'))
    );

    assert.equal(result.outputMarkdown, true);
  });

  it('should accept json flag', async () => {
    const result = await command(
      ['--json'],
      createReadStream(fixture('input.txt'))
    );

    assert.equal(result.outputJson, true);
  });

  it('should reject positional arguments', async () => {
    await assert.rejects(
      () => command(['unexpected'], createReadStream(fixture('input.txt'))),
      (/** @type {unknown} */ err) => err instanceof InputError && err.message.includes('Positional')
    );
  });

  it('should reject empty input', async () => {
    const empty = Readable.from('');
    await assert.rejects(
      () => command([], empty),
      (/** @type {unknown} */ err) => err instanceof InputError && err.message === 'Empty input'
    );
  });

  it('should reject --json and --markdown used together', async () => {
    await assert.rejects(
      () => command(['--json', '--markdown'], createReadStream(fixture('input.txt'))),
      (/** @type {unknown} */ err) => err instanceof InputError && err.message.includes('mutually exclusive')
    );
  });
});
