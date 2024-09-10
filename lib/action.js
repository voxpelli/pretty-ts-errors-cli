import { formatResult } from './format.js';

/**
 * @param {import('./command.js').CommandInput} input
 * @returns {Promise<void>}
 */
export async function action (input) {
  const result = {
    mainInput: input.mainInput,
  };

  // eslint-disable-next-line no-console
  console.log(formatResult(result, input));
}
