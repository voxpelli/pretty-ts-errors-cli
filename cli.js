#!/usr/bin/env node

import { isErrorWithCode } from '@voxpelli/typed-utils';
import { MarkdownOrChalk } from 'markdown-or-chalk';

import { messageWithCauses, stackWithCauses } from 'pony-cause';

import { cli } from './lib/main.js';
import { InputError, ResultError } from './lib/utils/errors.js';

/** @type {ReadonlySet<string>} */
const PARSE_ARGS_ERROR_CODES = new Set([
  'ERR_PARSE_ARGS_UNKNOWN_OPTION',
  'ERR_PARSE_ARGS_INVALID_OPTION_VALUE',
]);

/**
 * @param {unknown} err
 * @returns {{ title: string, message: string, body?: string }}
 */
function classifyError (err) {
  if (err instanceof InputError) {
    if (err.body !== undefined) {
      return { title: 'Invalid input', message: err.message, body: err.body };
    }
    return { title: 'Invalid input', message: err.message };
  }
  if (isErrorWithCode(err) && PARSE_ARGS_ERROR_CODES.has(err.code)) {
    return { title: 'Invalid input', message: err.message };
  }
  if (err instanceof Error) {
    return { title: 'Unexpected error', message: messageWithCauses(err), body: stackWithCauses(err) };
  }
  return { title: 'Unexpected error with no details', message: '' };
}

try {
  await cli();
} catch (err) {
  const format = new MarkdownOrChalk(false);

  if (err instanceof ResultError) {
    // eslint-disable-next-line no-console
    console.error(`${format.chalk?.white.bgRed('Result error:')} ${err.message}`);
    process.exit(2);
  }

  const { body, message, title } = classifyError(err);

  // eslint-disable-next-line no-console
  console.error(`${format.chalk?.white.bgRed(title + ':')} ${message}`);
  if (body) {
    // eslint-disable-next-line no-console
    console.error('\n' + body);
  }

  process.exit(1);
}
