// @ts-nocheck - Test file with Readable streams used as ReadStream
import { Readable } from 'node:stream';
import { readFile } from 'node:fs/promises';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { command } from '../lib/command.js';
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

describe('Integration tests', () => {
  describe('Full peowly flow', () => {
    it('should process plain diagnostic messages through full flow', async () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const inputText = await readFile(new URL('fixtures/input.txt', import.meta.url), 'utf8');
      const stream = Readable.from([inputText]);

      // Test command parsing
      const input = await command([], stream);
      input.should.have.property('outputMarkdown', false);
      input.should.have.property('inputStream');

      // Test action processing
      const outputs = [];
      for await (const output of action(input)) {
        outputs.push(output);
      }

      outputs.length.should.be.greaterThan(0);
      const result = outputs.join('\n');
      result.should.include('Type');
      result.should.include('not assignable');
    });

    it('should process plain diagnostic messages with markdown flag', async () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const inputText = await readFile(new URL('fixtures/input.txt', import.meta.url), 'utf8');
      const stream = Readable.from([inputText]);

      // Test command parsing with markdown flag
      const input = await command(['--markdown'], stream);
      input.should.have.property('outputMarkdown', true);
      input.should.have.property('inputStream');

      // Test action processing
      const outputs = [];
      for await (const output of action(input)) {
        outputs.push(output);
      }

      outputs.length.should.be.greaterThan(0);
      const result = outputs.join('\n');
      // Should include markdown attribution
      result.should.include('_Generated using');
      result.should.include('pretty-ts-errors-cli');
    });

    it('should process tsc output through full flow', async () => {
      const tscOutput = [
        '\u001B[96mtest.ts\u001B[0m:\u001B[93m1\u001B[0m:\u001B[93m7\u001B[0m - \u001B[91merror\u001B[0m\u001B[90m TS2322: \u001B[0mType \'number\' is not assignable to type \'string\'.',
        '',
        '\u001B[7m1\u001B[0m const x: string = 123;',
        '\u001B[7m \u001B[0m \u001B[91m      ~\u001B[0m',
        '',
        'Found 1 error.',
      ].join('\n');

      const stream = Readable.from([tscOutput]);

      // Test command parsing
      const input = await command([], stream);
      input.should.have.property('outputMarkdown', false);
      input.should.have.property('inputStream');

      // Test action processing
      const outputs = [];
      for await (const output of action(input)) {
        outputs.push(output);
      }

      outputs.length.should.be.greaterThan(0);
      const result = stripAnsi(outputs.join(''));
      result.should.include('Type');
      result.should.include('number');
      result.should.include('not assignable');
      result.should.include('string');
    });

    it('should process tsc watch output through full flow', async () => {
      const tscWatchOutput = [
        '[9:46:07 AM] Starting compilation in watch mode...',
        '',
        '\u001B[96mtest.ts\u001B[0m:\u001B[93m1\u001B[0m:\u001B[93m7\u001B[0m - \u001B[91merror\u001B[0m\u001B[90m TS2322: \u001B[0mType \'number\' is not assignable to type \'string\'.',
        '',
        '\u001B[7m1\u001B[0m const x: string = 123;',
        '\u001B[7m \u001B[0m \u001B[91m      ~\u001B[0m',
        '',
        'Found 1 error. Watching for file changes.',
      ].join('\n');

      const stream = Readable.from([tscWatchOutput]);

      // Test command parsing
      const input = await command([], stream);
      input.should.have.property('inputStream');

      // Test action processing
      const outputs = [];
      for await (const output of action(input)) {
        outputs.push(output);
      }

      // Should have extracted the diagnostic message, skipping watch status
      outputs.length.should.be.greaterThan(0);
      const result = stripAnsi(outputs.join(''));
      result.should.include('Type');
      result.should.include('number');
      result.should.include('not assignable');
      result.should.include('string');
      // Should NOT include watch status messages
      result.should.not.include('Starting compilation');
      result.should.not.include('Watching for file changes');
    });

    it('should process multiple tsc errors through full flow', async () => {
      const tscOutput = [
        '\u001B[96mtest.ts\u001B[0m:\u001B[93m1\u001B[0m:\u001B[93m7\u001B[0m - \u001B[91merror\u001B[0m\u001B[90m TS2322: \u001B[0mType \'number\' is not assignable to type \'string\'.',
        '',
        '\u001B[96mtest.ts\u001B[0m:\u001B[93m5\u001B[0m:\u001B[93m10\u001B[0m - \u001B[91merror\u001B[0m\u001B[90m TS2339: \u001B[0mProperty \'foo\' does not exist on type \'Bar\'.',
        '',
        'Found 2 errors.',
      ].join('\n');

      const stream = Readable.from([tscOutput]);

      // Test command parsing
      const input = await command([], stream);

      // Test action processing
      const outputs = [];
      for await (const output of action(input)) {
        outputs.push(output);
      }

      // Should have 2 formatted error messages
      outputs.length.should.equal(2);
      const result = stripAnsi(outputs.join('\n'));
      result.should.include('Type');
      result.should.include('number');
      result.should.include('Property');
      result.should.include('foo');
    });

    it('should handle empty input through full flow', async () => {
      const stream = Readable.from(['']);

      // Test command parsing
      const input = await command([], stream);
      input.should.have.property('inputStream');

      // Test action processing
      const outputs = [];
      for await (const output of action(input)) {
        outputs.push(output);
      }

      // Should produce no output for empty input
      outputs.should.have.lengthOf(0);
    });

    it('should handle short flag -m for markdown', async () => {
      const inputText = 'Type \'number\' is not assignable to type \'string\'.';
      const stream = Readable.from([inputText]);

      // Test command parsing with short flag
      const input = await command(['-m'], stream);
      input.should.have.property('outputMarkdown', true);

      // Test action processing
      const outputs = [];
      for await (const output of action(input)) {
        outputs.push(output);
      }

      outputs.length.should.be.greaterThan(0);
      const result = outputs.join('\n');
      result.should.include('_Generated using');
    });

    it('should reject positional arguments', async () => {
      const stream = Readable.from(['test']);

      // Should throw error for positional arguments
      await command(['some-file.txt'], stream).should.be.rejectedWith('Positional arguments are not supported');
    });
  });
});
