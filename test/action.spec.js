import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { action } from '../lib/action.js';

import { readFixture } from './helpers.js';

const mainInput = await readFixture('input.txt');
const expectedMarkdown = await readFixture('output.md');

describe('action()', () => {
  it('should format the output', () => {
    const result = action({ mainInput, outputJson: false, outputMarkdown: true });
    assert.equal(result + '\n', expectedMarkdown);
  });

  it('should format as JSON', () => {
    const result = action({ mainInput, outputJson: true, outputMarkdown: false });

    const parsed = JSON.parse(result);
    assert.equal(typeof parsed.formatted, 'string');
    assert.ok(parsed.formatted.includes('`Plugin`'));
  });

});
