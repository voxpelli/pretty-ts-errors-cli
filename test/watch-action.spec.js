import { Readable } from 'node:stream';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { watchAction } from '../lib/watch-action.js';

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

describe('watchAction()', () => {
  it('should process streaming tsc output', async () => {
    // Create a mock stream with tsc-like output
    const tscOutput = [
      '\u001B[96mtest.ts\u001B[0m:\u001B[93m1\u001B[0m:\u001B[93m7\u001B[0m - \u001B[91merror\u001B[0m\u001B[90m TS2322: \u001B[0mType \'number\' is not assignable to type \'string\'.',
      '',
      '\u001B[7m1\u001B[0m const x: string = 123;',
      '\u001B[7m \u001B[0m \u001B[91m      ~\u001B[0m',
      '',
      'Found 1 error.',
    ].join('\n');

    const stream = Readable.from([tscOutput]);

    const input = {
      inputStream: stream,
      outputMarkdown: false,
      watchMode: true,
      mainInput: '',
    };

    // Capture console output
    const originalLog = console.log;
    /** @type {string[]} */
    const logs = [];
    // eslint-disable-next-line no-console
    console.log = /** @param {string} msg */ (msg) => { logs.push(msg); };

    try {
      await watchAction(input);

      // Check that we got formatted output
      logs.length.should.be.greaterThan(0);
      const output = stripAnsi(logs.join(''));
      output.should.include('Type "number" is not assignable to type "string"');
    } finally {
      // eslint-disable-next-line no-console
      console.log = originalLog;
    }
  });

  it('should skip watch status messages', async () => {
    const tscOutput = [
      '[9:46:07 AM] Starting compilation in watch mode...',
      '\u001B[96mtest.ts\u001B[0m:\u001B[93m1\u001B[0m:\u001B[93m7\u001B[0m - \u001B[91merror\u001B[0m\u001B[90m TS2322: \u001B[0mType \'number\' is not assignable to type \'string\'.',
      '[9:46:09 AM] Found 1 error. Watching for file changes.',
    ].join('\n');

    const stream = Readable.from([tscOutput]);

    const input = {
      inputStream: stream,
      outputMarkdown: false,
      watchMode: true,
      mainInput: '',
    };

    const originalLog = console.log;
    /** @type {string[]} */
    const logs = [];
    // eslint-disable-next-line no-console
    console.log = /** @param {string} msg */ (msg) => { logs.push(msg); };

    try {
      await watchAction(input);

      // Check that we got formatted output without status messages
      const output = stripAnsi(logs.join(''));
      output.should.include('Type "number" is not assignable to type "string"');
      output.should.not.include('Starting compilation');
      output.should.not.include('Watching for file changes');
    } finally {
      // eslint-disable-next-line no-console
      console.log = originalLog;
    }
  });
});
