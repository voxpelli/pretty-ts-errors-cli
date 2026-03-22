import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { InputError, ResultError } from '../lib/utils/errors.js';

describe('InputError', () => {
  it('is an Error subclass with correct name', () => {
    const err = new InputError('test message');
    assert.ok(err instanceof Error);
    assert.equal(err.name, 'InputError');
    assert.equal(err.message, 'test message');
  });
});

describe('ResultError', () => {
  it('is an Error subclass with correct name', () => {
    const err = new ResultError('test message');
    assert.ok(err instanceof Error);
    assert.equal(err.name, 'ResultError');
    assert.equal(err.message, 'test message');
  });

  it('accepts error cause option', () => {
    const cause = new Error('root cause');
    const err = new ResultError('wrapper', { cause });
    assert.equal(err.cause, cause);
  });
});
