import { action } from './action.js';
import { watchAction } from './watch-action.js';
import { command } from './command.js';

export async function cli () {
  const input = await command(process.argv.slice(2), process.stdin);

  if (input.watchMode) {
    await watchAction(input);
  } else {
    const output = action(input);

    // eslint-disable-next-line no-console
    console.log(output);
  }
}
