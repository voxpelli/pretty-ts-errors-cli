import { action } from './action.js';
import { command } from './command.js';

export async function cli () {
  const input = await command();

  await action(input);
}
