import { createReadStream } from 'node:fs';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { command } from '../lib/command.js';

chai.use(chaiAsPromised);

chai.should();

describe('command()', () => {
  it('should return input stream', async () => {
    const stream = createReadStream(new URL('fixtures/input.txt', import.meta.url));
    const result = await command([], stream);

    result.should.be.an('object');
    result.should.have.property('outputMarkdown', false);
    result.should.have.property('inputStream', stream);
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
