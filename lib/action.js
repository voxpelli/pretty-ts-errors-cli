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
 * @returns {Promise<void>}
 */
export async function action (input) {
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

  // Parse input and format diagnostic messages
  for await (const errorMessage of parseTscErrors(rl)) {
    if (!errorMessage.trim()) continue;

    let result = formatDiagnosticMessage(errorMessage, (value, lang, multiLine) => {
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

    if (outputMarkdown) {
      result += '\n_Generated using [`@voxpelli/pretty-ts-errors-cli`](https://github.com/voxpelli/pretty-ts-errors-cli)_';
    }

    // Output immediately for streaming
    // eslint-disable-next-line no-console
    console.log(result);
  }
}
