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
    outputMarkdown,
  } = input;

  const format = new MarkdownOrChalk(outputMarkdown);

  const result = formatDiagnosticMessage(mainInput, (value, lang, multiLine) => {
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

  return result;
}
