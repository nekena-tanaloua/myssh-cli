import inquirer from 'inquirer';
import chalk from 'chalk';
import readline from 'readline';

export class Commands {
  constructor(manager) {
    this.manager = manager;
  }

  async showMainMenu() {
    console.clear();

    try {
      try {
        await this.manager.initialize();
      } catch (error) {
        if (error.message.includes('Incorrect master password')) {
          console.error(chalk.red('\nError: Incorrect master password'));
          process.exit(1);
        }
        throw error;
      }

      if (this.manager.currentWorkspace) {
        console.log(chalk.blue(`\n[${this.manager.currentWorkspace}]\n`));
      } else {
        console.log(chalk.yellow('\n[No workspace selected]\n'));
      }

      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            'Connect',
            'Add connection',
            'List connections',
            'Switch workspace',
            'Quit',
          ],
        },
      ]);

      switch (action) {
        case 'Connect': {
          const sshProcess = await this.manager.connect();
          if (sshProcess) {
            await new Promise((resolve) => sshProcess.once('exit', resolve));
            if (process.stdin.isTTY) {
              process.stdin.setRawMode(false);
            }

            await new Promise((resolve) => {
              const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
              });
              rl.question('Press Enter to return to the menu...', () => {
                rl.close();
                resolve();
              });
            });
          }
          return true;
        }
        case 'Add connection':
          await this.manager.addConnection();
          return true;
        case 'List connections':
          await this.manager.listConnections();
          return true;
        case 'Switch workspace':
          await this.manager.switchWorkspace();
          return true;
        case 'Quit':
          return false;
      }
    } catch (error) {
      console.error(chalk.red('Error:', error.message));
      return true;
    }
  }

  async run() {
    let keepRunning = true;
    while (keepRunning) {
      keepRunning = await this.showMainMenu();
    }
  }
}
