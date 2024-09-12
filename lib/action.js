import { formatDiagnosticMessage } from '@pretty-ts-errors/formatter';
import {
  MarkdownOrChalk,
} from 'markdown-or-chalk';

/**
 * @param {import('./command.js').CommandInput} input
 * @returns {Promise<void>}
 */
export async function action (input) {
  const {
    mainInput,
    outputMarkdown,
  } = input;

  const format = new MarkdownOrChalk(outputMarkdown);

  const result = formatDiagnosticMessage(mainInput, (value, lang, multiLine) => {
    if (multiLine) {
      return '\n' + format.indent(format.fromMdast({
        type: 'code',
        lang: lang === 'type' ? 'ts' : lang,
        value,
      })) + '\n';
    }

    return '"' +
      format.fromMdast({
        type: 'inlineCode',
        value,
      }).trim() +
      '"';
  });

  // eslint-disable-next-line no-console
  console.log(result);
}
