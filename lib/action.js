import { formatDiagnosticMessage } from '@pretty-ts-errors/formatter';
import {
  MarkdownOrChalk,
} from 'markdown-or-chalk';

/**
 * @param {import('./command.js').CommandInput} input
 * @returns {string}
 */
export function action (input) {
  const {
    mainInput,
    outputJson,
    outputMarkdown,
  } = input;

  const format = new MarkdownOrChalk(outputJson || outputMarkdown);

  let result = formatDiagnosticMessage(mainInput, (value, lang, multiLine) => {
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

  if (outputJson) {
    return JSON.stringify({ formatted: result });
  }

  if (outputMarkdown) {
    result += '\n_Generated using [`@voxpelli/pretty-ts-errors-cli`](https://github.com/voxpelli/pretty-ts-errors-cli)_';
  }

  return result;
}
