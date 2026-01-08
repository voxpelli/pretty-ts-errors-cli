// @ts-nocheck - Test file with chai assertions
import { Readable } from 'node:stream';
import { createInterface } from 'node:readline';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { parseTscErrors } from '../lib/utils/tsc-parser.js';

chai.use(chaiAsPromised);

chai.should();

describe('tsc-parser', () => {
  describe('parseTscErrors()', () => {
    it('should extract diagnostic messages from tsc output', async () => {
      const tscOutput = [
        '\u001B[96mtest.ts\u001B[0m:\u001B[93m1\u001B[0m:\u001B[93m7\u001B[0m - \u001B[91merror\u001B[0m\u001B[90m TS2322: \u001B[0mType \'number\' is not assignable to type \'string\'.',
        '',
        '\u001B[7m1\u001B[0m const x: string = 123;',
        '\u001B[7m \u001B[0m \u001B[91m      ~\u001B[0m',
      ].join('\n');

      const stream = Readable.from([tscOutput]);
      const rl = createInterface({ input: stream, crlfDelay: Infinity });

      const messages = [];
      for await (const msg of parseTscErrors(rl)) {
        messages.push(msg);
      }

      messages.should.have.lengthOf(1);

      messages[0].should.equal('Type \'number\' is not assignable to type \'string\'.');
    });

    it('should pass through plain diagnostic messages', async () => {
      const plainMessage = 'Type \'number\' is not assignable to type \'string\'.';
      const stream = Readable.from([plainMessage]);
      const rl = createInterface({ input: stream, crlfDelay: Infinity });

      const messages = [];
      for await (const msg of parseTscErrors(rl)) {
        messages.push(msg);
      }

      messages.should.have.lengthOf(1);
      messages[0].should.equal(plainMessage + '\n');
    });

    it('should skip watch status messages with 12-hour format', async () => {
      const tscOutput = [
        '[9:46:07 AM] Starting compilation in watch mode...',
        '\u001B[96mtest.ts\u001B[0m:\u001B[93m1\u001B[0m:\u001B[93m7\u001B[0m - \u001B[91merror\u001B[0m\u001B[90m TS2322: \u001B[0mType \'number\' is not assignable to type \'string\'.',
        '[9:46:09 AM] Found 1 error. Watching for file changes.',
      ].join('\n');

      const stream = Readable.from([tscOutput]);
      const rl = createInterface({ input: stream, crlfDelay: Infinity });

      const messages = [];
      for await (const msg of parseTscErrors(rl)) {
        messages.push(msg);
      }

      messages.should.have.lengthOf(1);

      messages[0].should.equal('Type \'number\' is not assignable to type \'string\'.');
    });

    it('should skip watch status messages with 24-hour format', async () => {
      const tscOutput = [
        '[21:46:07] Starting compilation in watch mode...',
        '\u001B[96mtest.ts\u001B[0m:\u001B[93m1\u001B[0m:\u001B[93m7\u001B[0m - \u001B[91merror\u001B[0m\u001B[90m TS2322: \u001B[0mType \'number\' is not assignable to type \'string\'.',
        '[21:46:09] Found 1 error. Watching for file changes.',
      ].join('\n');

      const stream = Readable.from([tscOutput]);
      const rl = createInterface({ input: stream, crlfDelay: Infinity });

      const messages = [];
      for await (const msg of parseTscErrors(rl)) {
        messages.push(msg);
      }

      messages.should.have.lengthOf(1);

      messages[0].should.equal('Type \'number\' is not assignable to type \'string\'.');
    });

    it('should skip summary lines', async () => {
      const tscOutput = [
        '\u001B[96mtest.ts\u001B[0m:\u001B[93m1\u001B[0m:\u001B[93m7\u001B[0m - \u001B[91merror\u001B[0m\u001B[90m TS2322: \u001B[0mType \'number\' is not assignable to type \'string\'.',
        '',
        'Found 1 error.',
      ].join('\n');

      const stream = Readable.from([tscOutput]);
      const rl = createInterface({ input: stream, crlfDelay: Infinity });

      const messages = [];
      for await (const msg of parseTscErrors(rl)) {
        messages.push(msg);
      }

      messages.should.have.lengthOf(1);

      messages[0].should.equal('Type \'number\' is not assignable to type \'string\'.');
    });

    it('should handle multiple tsc errors', async () => {
      const tscOutput = [
        '\u001B[96mtest.ts\u001B[0m:\u001B[93m1\u001B[0m:\u001B[93m7\u001B[0m - \u001B[91merror\u001B[0m\u001B[90m TS2322: \u001B[0mType \'number\' is not assignable to type \'string\'.',
        '',
        '\u001B[96mtest.ts\u001B[0m:\u001B[93m5\u001B[0m:\u001B[93m10\u001B[0m - \u001B[91merror\u001B[0m\u001B[90m TS2339: \u001B[0mProperty \'foo\' does not exist on type \'Bar\'.',
        '',
        'Found 2 errors.',
      ].join('\n');

      const stream = Readable.from([tscOutput]);
      const rl = createInterface({ input: stream, crlfDelay: Infinity });

      const messages = [];
      for await (const msg of parseTscErrors(rl)) {
        messages.push(msg);
      }

      messages.should.have.lengthOf(2);
      messages[0].should.equal('Type \'number\' is not assignable to type \'string\'.');
      messages[1].should.equal('Property \'foo\' does not exist on type \'Bar\'.');
    });

    it('should strip ANSI codes from error messages', async () => {
      const tscOutput = '\u001B[96mtest.ts\u001B[0m:\u001B[93m1\u001B[0m:\u001B[93m7\u001B[0m - \u001B[91merror\u001B[0m\u001B[90m TS2322: \u001B[0m\u001B[31mType \'number\' is not assignable to type \'string\'.\u001B[0m';
      const stream = Readable.from([tscOutput]);
      const rl = createInterface({ input: stream, crlfDelay: Infinity });

      const messages = [];
      for await (const msg of parseTscErrors(rl)) {
        messages.push(msg);
      }

      messages.should.have.lengthOf(1);
      // The extracted message should not contain ANSI codes
      // eslint-disable-next-line no-control-regex
      messages[0].should.not.match(/\u001B/);
      messages[0].should.equal('Type \'number\' is not assignable to type \'string\'.');
    });
  });
});
