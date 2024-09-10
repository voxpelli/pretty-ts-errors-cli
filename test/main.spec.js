import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { command } from '../lib/command.js';

chai.use(chaiAsPromised);

chai.should();

describe('something', () => {
  it('should work', async () => {
    await command().should.eventually.be.an('object');
  });
});
