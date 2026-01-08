import { createInterface } from 'node:readline';
import { formatDiagnosticMessage } from '@pretty-ts-errors/formatter';
import {
  MarkdownOrChalk,
} from 'markdown-or-chalk';
import { parseTscErrors } from './utils/tsc-parser.js';

/**
 * Process input stream and format diagnostic messages
 *
 * @param {import('./command.js').CommandInput} input
 * @returns {AsyncGenerator<string, void, undefined>}
 */
export async function * action (input) {
  const {
    inputStream,
    outputMarkdown,
  } = input;

  const format = new MarkdownOrChalk(outputMarkdown);

  // Create readline interface for line-by-line processing
  const rl = createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  try {
    // Parse input and format diagnostic messages
    for await (const errorMessage of parseTscErrors(rl)) {
      if (!errorMessage.trim()) continue;

      /** @type {string} */
      let result;
      try {
        result = formatDiagnosticMessage(errorMessage, (value, lang, multiLine) => {
          if (multiLine) {
            return '\n' + format.fromMdast({
              type: 'code',
              lang: lang === 'type' ? 'ts' : lang,
              value,
            }) + '\n';
          }

          const quote = format.chalkOnly ? '"' : '';

          return quote +
            format.fromMdast({
              type: 'inlineCode',
              value,
            }).trim() +
            quote;
        });
      } catch (err) {
        // Ensure that a failure in diagnostic formatting does not terminate the stream processing
        // eslint-disable-next-line no-console
        console.error('Failed to format diagnostic message:', err);
        // eslint-disable-next-line no-console
        console.error('Original error message:\n' + errorMessage);
        continue;
      }

      if (outputMarkdown) {
        result += '\n_Generated using [`@voxpelli/pretty-ts-errors-cli`](https://github.com/voxpelli/pretty-ts-errors-cli)_';
      }

      // Yield the formatted result instead of printing it
      yield result;
    }
  } finally {
    rl.close();
  }
}
