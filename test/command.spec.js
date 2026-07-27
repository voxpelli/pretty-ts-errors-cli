import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';

import { command } from '../lib/command.js';
import { InputError } from '../lib/utils/errors.js';

import { readFixture, inputStream } from './helpers.js';

const mainInput = await readFixture('input.txt');

describe('command()', () => {
  it('should accept the input', async () => {
    const result = await command([], inputStream());

    assert.deepEqual(result, {
      mainInput,
      outputJson: false,
      outputMarkdown: false,
    });
  });

  it('should accept markdown flag', async () => {
    const result = await command(['--markdown'], inputStream());
    assert.equal(result.outputMarkdown, true);
  });

  it('should accept json flag', async () => {
    const result = await command(['--json'], inputStream());
    assert.equal(result.outputJson, true);
  });

  it('should accept -j short flag', async () => {
    const result = await command(['-j'], inputStream());
    assert.equal(result.outputJson, true);
  });

  it('should accept -m short flag', async () => {
    const result = await command(['-m'], inputStream());
    assert.equal(result.outputMarkdown, true);
  });

  it('should reject positional arguments', async () => {
    await assert.rejects(
      () => command(['unexpected'], inputStream()),
      (/** @type {unknown} */ err) => {
        assert.ok(err instanceof InputError);
        assert.match(err.message, /Positional/);
        return true;
      }
    );
  });

  it('should reject empty input', async () => {
    const empty = /** @type {import('node:fs').ReadStream} */ (Readable.from(''));
    await assert.rejects(
      () => command([], empty),
      (/** @type {unknown} */ err) => {
        assert.ok(err instanceof InputError);
        assert.strictEqual(err.message, 'Empty input');
        return true;
      }
    );
  });

  it('should reject --json and --markdown used together', async () => {
    await assert.rejects(
      () => command(['--json', '--markdown'], inputStream()),
      (/** @type {unknown} */ err) => {
        assert.ok(err instanceof InputError);
        assert.match(err.message, /mutually exclusive/);
        return true;
      }
    );
  });
});
