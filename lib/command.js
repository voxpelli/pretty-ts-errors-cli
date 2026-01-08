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
  watch: {
    description: 'Watch mode for streaming input like tsc --watch. Processes and outputs errors in real-time',
    listGroup: 'Input options',
    'short': 'w',
    type: 'boolean',
    'default': false,
  },
});

/**
 * @typedef CommandInput
 * @property {boolean} outputMarkdown
 * @property {boolean} watchMode
 * @property {string} mainInput
 * @property {NodeJS.ReadableStream | undefined} inputStream
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
      watch: watchMode,
      // ...remainingFlags
    },
    input: [...otherInput],
    showHelp,
  } = peowly({
    args,
    examples: [
      { prefix: 'cat raw-error.txt |' },
      { prefix: 'pbpaste |', suffix: '-m | pbcopy' },
      { prefix: 'tsc --watch |', suffix: '--watch' },
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

  // In watch mode, we return the stream for line-by-line processing
  if (watchMode) {
    /** @type {CommandInput} */
    const result = {
      mainInput: '',
      outputMarkdown,
      watchMode,
      inputStream: stdin,
    };
    return result;
  }

  let mainInput = '';

  stdin.setEncoding('utf8');
  // type-coverage:ignore-next-line Content of streams can't be typed currently?
  for await (const chunk of stdin) {
    mainInput += /** @type {string} */ (chunk);
  }

  if (!mainInput) {
    throw new InputError('Empty input');
  }

  /** @type {CommandInput} */
  const result = {
    mainInput,
    outputMarkdown,
    watchMode,
    inputStream: undefined,
  };

  return result;
}
