import inquirer from 'inquirer';

export function restoreTerminal() {
  if (process.stdin.isTTY) {
    try {
      // If in raw mode, disable it
      process.stdin.setRawMode(false);
    } catch (e) {
      // Might already be in normal mode
    }
    process.stdin.pause();
  }

  process.stdout.write('\x1B[?25h');
}

export async function promptSafe(questions) {
  try {
    return await inquirer.prompt(questions);
  } catch (error) {
    // Usually means user pressed CTRL+C
    restoreTerminal();
    process.exit(0);
  }
}
