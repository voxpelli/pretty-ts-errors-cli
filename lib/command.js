import { text } from 'node:stream/consumers';

import { peowly } from 'peowly';

import { pkg } from './utils/pkg.js';
import { InputError } from './utils/errors.js';

const options = /** @satisfies {import('peowly').AnyFlags} */ ({
  json: {
    description: 'Output the result as JSON. Useful for programmatic consumption',
    listGroup: 'Output options',
    'short': 'j',
    type: 'boolean',
    'default': false,
  },
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
 * @property {boolean} outputJson
 * @property {boolean} outputMarkdown
 * @property {string} mainInput
 */

/**
 * @param {string[]} args
 * @param {import('node:fs').ReadStream | import('node:tty').ReadStream} stdin
 * @returns {Promise<CommandInput>}
 */
export async function command (args, stdin) {
  const {
    flags: {
      json: outputJson,
      markdown: outputMarkdown,
    },
    input: [...otherInput],
    showHelp,
  } = peowly({
    args,
    examples: [
      { prefix: 'cat raw-error.txt |' },
      { prefix: 'pbpaste |', suffix: '-m | pbcopy' },
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

  const mainInput = await text(stdin);

  if (!mainInput) {
    throw new InputError('Empty input');
  }

  /** @type {CommandInput} */
  const result = {
    mainInput,
    outputJson,
    outputMarkdown,
  };

  return result;
}
