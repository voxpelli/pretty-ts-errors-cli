import { Readable } from 'node:stream';
import { readFile } from 'node:fs/promises';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { action } from '../lib/action.js';

chai.use(chaiAsPromised);

chai.should();

/**
 * Strip ANSI codes from string
 *
 * @param {string} str
 * @returns {string}
 */
function stripAnsi (str) {
  // eslint-disable-next-line no-control-regex
  return str.replaceAll(/\u001B\[[0-9;]*m/g, '');
}

describe('action()', () => {
  it('should format the output', async () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const inputText = await readFile(new URL('fixtures/input.txt', import.meta.url), 'utf8');
    const stream = Readable.from([inputText]);

    // Capture console output
    const originalLog = console.log;
    /** @type {string[]} */
    const logs = [];
    // eslint-disable-next-line no-console
    console.log = /** @param {string} msg */ (msg) => { logs.push(msg); };

    try {
      await action({
        inputStream: stream,
        outputMarkdown: true,
      });

      // Check that we got formatted output
      const result = logs.join('\n') + '\n';
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      result.should.equal(await readFile(new URL('fixtures/output.md', import.meta.url), 'utf8'));
    } finally {
      // eslint-disable-next-line no-console
      console.log = originalLog;
    }
  });

  it('should handle tsc output format', async () => {
    const tscOutput = [
      '\u001B[96mtest.ts\u001B[0m:\u001B[93m1\u001B[0m:\u001B[93m7\u001B[0m - \u001B[91merror\u001B[0m\u001B[90m TS2322: \u001B[0mType \'number\' is not assignable to type \'string\'.',
      '',
      '\u001B[7m1\u001B[0m const x: string = 123;',
      '\u001B[7m \u001B[0m \u001B[91m      ~\u001B[0m',
      '',
      'Found 1 error.',
    ].join('\n');

    const stream = Readable.from([tscOutput]);

    const originalLog = console.log;
    /** @type {string[]} */
    const logs = [];
    // eslint-disable-next-line no-console
    console.log = /** @param {string} msg */ (msg) => { logs.push(msg); };

    try {
      await action({
        inputStream: stream,
        outputMarkdown: false,
      });

      // Check that we got formatted output
      logs.length.should.be.greaterThan(0);
      const output = stripAnsi(logs.join(''));
      output.should.include('Type "number" is not assignable to type "string"');
    } finally {
      // eslint-disable-next-line no-console
      console.log = originalLog;
    }
  });
});
