#!/usr/bin/env node

import { isErrorWithCode } from '@voxpelli/typed-utils';
import { MarkdownOrChalk } from 'markdown-or-chalk';

import { messageWithCauses, stackWithCauses } from 'pony-cause';

import { cli } from './lib/main.js';
import { InputError, ResultError } from './lib/utils/errors.js';

try {
  await cli();
} catch (err) {
  /** @type {string|undefined} */
  let errorTitle;
  /** @type {string} */
  let errorMessage = '';
  /** @type {string|undefined} */
  let errorBody;

  if (err instanceof ResultError) {
    process.exit(2);
  }

  if (err instanceof InputError) {
    errorTitle = 'Invalid input';
    errorMessage = err.message;
    errorBody = err.body;
  } else if (isErrorWithCode(err) && (err.code === 'ERR_PARSE_ARGS_UNKNOWN_OPTION' || err.code === 'ERR_PARSE_ARGS_INVALID_OPTION_VALUE')) {
    errorTitle = 'Invalid input';
    errorMessage = err.message;
  }

  if (!errorTitle) {
    if (err instanceof Error) {
      errorTitle = 'Unexpected error';
      errorMessage = messageWithCauses(err);
      errorBody = stackWithCauses(err);
    } else {
      errorTitle = 'Unexpected error with no details';
    }
  }

  const format = new MarkdownOrChalk(false);

  // eslint-disable-next-line no-console
  console.error(`${format.chalk?.white.bgRed(errorTitle + ':')} ${errorMessage}`);
  if (errorBody) {
    // eslint-disable-next-line no-console
    console.error('\n' + errorBody);
  }

  process.exit(1);
}
