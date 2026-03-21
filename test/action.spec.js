import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { action } from '../lib/action.js';

describe('action()', () => {
  it('should format the output', async () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const mainInput = await readFile(new URL('fixtures/input.txt', import.meta.url), 'utf8');
    const result = action({ mainInput, outputJson: false, outputMarkdown: true });

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const expected = await readFile(new URL('fixtures/output.md', import.meta.url), 'utf8');
    assert.equal(result + '\n', expected);
  });

  it('should format as JSON', async () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const mainInput = await readFile(new URL('fixtures/input.txt', import.meta.url), 'utf8');
    const result = action({ mainInput, outputJson: true, outputMarkdown: false });

    const parsed = JSON.parse(result);
    assert.equal(typeof parsed.formatted, 'string');
    assert.ok(parsed.formatted.includes('`Plugin`'));
  });
});
