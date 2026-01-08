import { createReadStream } from 'node:fs';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { command } from '../lib/command.js';
import { readFile } from 'node:fs/promises';

chai.use(chaiAsPromised);

chai.should();

describe('command()', () => {
  it('should accept the input', async () => {
    const result = await command(
      [],
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      createReadStream(new URL('fixtures/input.txt', import.meta.url))
    );

    result.should.deep.equal({
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      mainInput: await readFile(new URL('fixtures/input.txt', import.meta.url), 'utf8'),
      outputMarkdown: false,
      watchMode: false,
      inputStream: undefined,
    });
  });

  it('should accept markdown flag', async () => {
    const result = await command(
      ['--markdown'],
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      createReadStream(new URL('fixtures/input.txt', import.meta.url))
    );

    result.should.be.an('object').with.property('outputMarkdown', true);
  });
});
