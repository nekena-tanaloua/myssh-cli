#!/usr/bin/env node
import { Manager } from './manager.js';
import { Commands } from './commands.js';
import chalk from 'chalk';

process.on('SIGINT', () => {
  console.log('\nExiting...');
  process.exit(0);
});

async function resetDatabase() {
  const manager = new Manager();
  await manager.reset();
  console.log(chalk.green('Database has been reset successfully.'));
  process.exit(0);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--reset') || args.includes('-r')) {
    await resetDatabase();
    return;
  }

  const manager = new Manager();
  const cli = new Commands(manager);
  await cli.run();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
