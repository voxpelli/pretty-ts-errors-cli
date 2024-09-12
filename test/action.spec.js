import { readFile } from 'node:fs/promises';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { action } from '../lib/action.js';

chai.use(chaiAsPromised);

chai.should();

describe('action()', () => {
  it('should format the output', async () => {
    const result = await action({
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      mainInput: await readFile(new URL('fixtures/input.txt', import.meta.url), 'utf8'),
      outputMarkdown: true,
    });

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    (result + '\n').should.equal(await readFile(new URL('fixtures/output.md', import.meta.url), 'utf8'));
  });
});
