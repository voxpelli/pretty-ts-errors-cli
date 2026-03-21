import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';

import { command } from '../lib/command.js';

describe('command()', () => {
  it('should accept the input', async () => {
    const result = await command(
      [],
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      createReadStream(new URL('fixtures/input.txt', import.meta.url))
    );

    assert.deepEqual(result, {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      mainInput: await readFile(new URL('fixtures/input.txt', import.meta.url), 'utf8'),
      outputJson: false,
      outputMarkdown: false,
    });
  });

  it('should accept markdown flag', async () => {
    const result = await command(
      ['--markdown'],
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      createReadStream(new URL('fixtures/input.txt', import.meta.url))
    );

    assert.equal(result.outputMarkdown, true);
  });

  it('should accept json flag', async () => {
    const result = await command(
      ['--json'],
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      createReadStream(new URL('fixtures/input.txt', import.meta.url))
    );

    assert.equal(result.outputJson, true);
  });
});
