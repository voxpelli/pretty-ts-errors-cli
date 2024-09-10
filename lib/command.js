import { peowly } from 'peowly';
import { readPkg } from './utils/pkg.js';
import { InputError } from './utils/errors.js';

const options = /** @satisfies {import('peowly').AnyFlags} */ ({
  debug: {
    description: 'Use to output debug data',
    type: 'boolean',
    'default': false,
    'short': 'd',
  },
  json: {
    description: 'Output the results as JSON',
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
  'no-links': {
    description: 'Skips adding hyperlinks',
    listGroup: 'Output options',
    type: 'boolean',
    'default': false,
  },
});

/**
 * @typedef CommandInput
 * @property {boolean} debug
 * @property {boolean} noLinks
 * @property {boolean} outputJson
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
      debug,
      json: outputJson,
      markdown: outputMarkdown,
      'no-links': noLinks,
      // ...remainingFlags
    },
    input: [mainInput, ...otherInput],
    showHelp,
  } = peowly({
    // examples: [
    //   { prefix: 'cat input-fixcole.ndjson |', suffix: 'installed-check > output-file.ndjson' },
    //   '-n installed-check',
    // ],
    options,
    pkg,
    // usage: '<name-of-npm-module> [target-file.ndjson]',
  });

  if (otherInput.length > 0) {
    throw new InputError('Too many inputs');
  }

  if (!mainInput) {
    showHelp();
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit();
  }

  /** @type {CommandInput} */
  const result = {
    debug,
    mainInput,
    noLinks,
    outputJson,
    outputMarkdown,
  };

  return result;
}
