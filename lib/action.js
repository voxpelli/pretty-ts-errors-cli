import { formatDiagnosticMessage } from '@pretty-ts-errors/formatter';
import { MarkdownOrChalk } from 'markdown-or-chalk';

import { ResultError } from './utils/errors.js';

const ATTRIBUTION_FOOTER =
  '\n_Generated using [`@voxpelli/pretty-ts-errors-cli`](https://github.com/voxpelli/pretty-ts-errors-cli)_';

/**
 * @param {MarkdownOrChalk} format
 * @returns {import('@pretty-ts-errors/formatter').CodeBlock}
 */
function makeCodeBlockFn (format) {
  return (value, lang, multiLine) => {
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
  };
}

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

  const useMarkdownMode = outputJson || outputMarkdown;
  const format = new MarkdownOrChalk(useMarkdownMode);

  /** @type {string} */
  let result;
  try {
    result = formatDiagnosticMessage(mainInput, makeCodeBlockFn(format));
  /* c8 ignore next 3 */
  } catch (err) {
    throw new ResultError('Failed to format TypeScript diagnostic', { cause: err });
  }

  if (outputJson) {
    return JSON.stringify({ formatted: result });
  }

  if (outputMarkdown) {
    result += ATTRIBUTION_FOOTER;
  }

  return result;
}
