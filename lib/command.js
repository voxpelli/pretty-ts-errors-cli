import { peowly } from 'peowly';

import { readPkg } from './utils/pkg.js';
import { InputError } from './utils/errors.js';

const options = /** @satisfies {import('peowly').AnyFlags} */ ({
  markdown: {
    description: 'Format the result as Markdown. Useful for copy and pasting into eg. GitHub',
    listGroup: 'Output options',
    'short': 'm',
    type: 'boolean',
    'default': false,
  },
});

/**
 * @typedef CommandInput
 * @property {boolean} outputMarkdown
 * @property {NodeJS.ReadableStream} inputStream
 */

/**
 * @param {string[]} args
 * @param {import('node:fs').ReadStream | import('node:tty').ReadStream} stdin
 * @returns {Promise<CommandInput>}
 */
export async function command (args, stdin) {
  const pkg = await readPkg();

  const {
    flags: {
      markdown: outputMarkdown,
      // ...remainingFlags
    },
    input: [...otherInput],
    showHelp,
  } = peowly({
    args,
    examples: [
      { prefix: 'cat raw-error.txt |' },
      { prefix: 'pbpaste |', suffix: '-m | pbcopy' },
      { prefix: 'tsc --watch |' },
    ],
    options,
    name: 'pretty-ts-errors',
    pkg,
  });

  if ('isTTY' in stdin && stdin.isTTY) {
    showHelp(0);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit();
  }

  if (otherInput.length > 0) {
    throw new InputError('Positional arguments are not supported');
  }

  // Always use streaming mode - works for both tsc output and plain diagnostic messages
  /** @type {CommandInput} */
  const result = {
    outputMarkdown,
    inputStream: stdin,
  };

  return result;
}
