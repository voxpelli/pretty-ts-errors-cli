import getStdin from 'get-stdin';
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
 * @property {string} mainInput
 */

/**
 * @returns {Promise<CommandInput>}
 */
export async function command () {
  const pkg = await readPkg();

  const {
    flags: {
      markdown: outputMarkdown,
      // ...remainingFlags
    },
    input: [...otherInput],
    showHelp,
  } = peowly({
    examples: [
      { prefix: 'cat raw-error.txt |' },
      { prefix: 'pbpaste |', suffix: '-m | pbcopy' },
    ],
    options,
    name: 'pretty-ts-errors',
    pkg,
  });

  if (otherInput.length > 0) {
    throw new InputError('Positional arguments are not supported');
  }

  const mainInput = await getStdin();

  if (!mainInput) {
    showHelp(0);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit();
  }

  /** @type {CommandInput} */
  const result = {
    mainInput,
    outputMarkdown,
  };

  return result;
}
