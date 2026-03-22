/* eslint-disable security/detect-non-literal-fs-filename */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { action } from '../lib/action.js';
import { ResultError } from '../lib/utils/errors.js';

/**
 * @param {string} name
 * @returns {URL}
 */
const fixture = (name) => new URL(`fixtures/${name}`, import.meta.url);

const mainInput = await readFile(fixture('input.txt'), 'utf8');
const expectedMarkdown = await readFile(fixture('output.md'), 'utf8');

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

  it('ResultError is an Error subclass with correct name', () => {
    const err = new ResultError('test message');
    assert.ok(err instanceof Error);
    assert.equal(err.name, 'ResultError');
    assert.equal(err.message, 'test message');
  });
});
