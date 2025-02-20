import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { promptSafe } from './prompt-safe.js'; // import from the helper module

import inquirer from 'inquirer';
import { promises as fs } from 'fs';
import { WorkspaceUtils } from './lib/workspace-utils.js';
import { SSHUtils } from './lib/ssh-utils.js';
import { CONFIG } from './config.js';

export class Manager {
  constructor(configPath = CONFIG.defaultConfigPath) {
    this.configPath = path.join(os.homedir(), configPath);
    this.currentWorkspace = null;
    this._masterPassword = null;
    this._currentData = null;
  }

  async initialize() {
    if (!this._masterPassword) {
      this._masterPassword = await this.getMasterPassword();
      this._currentData = await WorkspaceUtils.loadData(
        this.configPath,
        this._masterPassword
      );
    }

    if (
      !this._currentData.lastWorkspace ||
      !this._currentData.workspaces[this._currentData.lastWorkspace]
    ) {
      // Aucun workspace valide, on invite l'utilisateur à en créer un ou à en choisir un.
      this.currentWorkspace = await WorkspaceUtils.selectWorkspace(
        this.configPath,
        this._currentData,
        this._masterPassword
      );
      console.log(chalk.blue(`\nActive workspace: ${this.currentWorkspace}`));
    } else {
      this.currentWorkspace = this._currentData.lastWorkspace;
      console.log(chalk.blue(`\nActive workspace: ${this.currentWorkspace}`));
    }

    return this._currentData;
  }

  async getMasterPassword() {
    let masterPromptMessage = 'Enter master password:';
    try {
      await fs.access(this.configPath);
    } catch (error) {
      masterPromptMessage = 'Create a master password:';
    }

    const { password } = await promptSafe([
      {
        type: 'password',
        name: 'password',
        message: masterPromptMessage,
        validate: (input) =>
          input.length >= 8 || 'Password must be at least 8 characters',
      },
    ]);

    return password;
  }

  async switchWorkspace() {
    await this.initialize();
    console.log(chalk.blue(`\nCurrent workspace: ${this.currentWorkspace}`));
    this.currentWorkspace = await WorkspaceUtils.selectWorkspace(
      this.configPath,
      this._currentData,
      this._masterPassword
    );
    return this.currentWorkspace;
  }

  async addConnection() {
    await this.initialize();

    if (!this.currentWorkspace) {
      await this.switchWorkspace();
    }

    const sshKeys = await SSHUtils.getAvailableSSHKeys();

    const answers = await promptSafe([
      {
        type: 'input',
        name: 'name',
        message: 'Connection name:',
        validate: (input) => input.length > 0 || 'Name cannot be empty',
      },
      {
        type: 'input',
        name: 'host',
        message: 'Host:',
        validate: (input) => input.length > 0 || 'Host cannot be empty',
      },
      {
        type: 'input',
        name: 'username',
        message: 'Username:',
        validate: (input) => input.length > 0 || 'Username cannot be empty',
      },
      {
        type: 'list',
        name: 'keyPath',
        message: 'Select SSH key:',
        choices: sshKeys,
        validate: (input) => {
          if (sshKeys.length === 0) {
            return 'No SSH keys found in ~/.ssh/';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'port',
        message: 'Port:',
        default: '22',
      },
    ]);

    this._currentData.workspaces[this.currentWorkspace].connections[
      answers.name
    ] = {
      host: answers.host,
      username: answers.username,
      port: parseInt(answers.port),
      keyPath: answers.keyPath,
      createdAt: new Date().toISOString(),
    };

    await WorkspaceUtils.saveData(
      this.configPath,
      this._currentData,
      this._masterPassword
    );
    console.log(
      chalk.green(
        `✓ Connection "${answers.name}" added to workspace "${this.currentWorkspace}"`
      )
    );
  }

  async listConnections() {
    await this.initialize();

    if (!this.currentWorkspace) {
      await this.switchWorkspace();
    }

    const workspace = this._currentData.workspaces[this.currentWorkspace];
    if (!workspace || Object.keys(workspace.connections).length === 0) {
      console.log(
        chalk.yellow(`\nNo connections in workspace "${this.currentWorkspace}"`)
      );
      await promptSafe([
        {
          type: 'input',
          name: 'continue',
          message: 'Press Enter to continue...',
        },
      ]);
      return;
    }

    console.log(
      chalk.blue(`\nConnections in workspace "${this.currentWorkspace}":`)
    );
    Object.entries(workspace.connections).forEach(([name, conn]) => {
      console.log(chalk.yellow(`\n${name}:`));
      console.log(`  Host: ${conn.host}`);
      console.log(`  Username: ${conn.username}`);
      console.log(`  Port: ${conn.port}`);
      if (conn.keyPath) console.log(`  Key: ${conn.keyPath}`);
    });

    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: 'Press Enter to continue...',
      },
    ]);
  }

  async connect(nameArg = null) {
    await this.initialize();

    if (!this.currentWorkspace) {
      await this.switchWorkspace();
    }

    const workspace = this._currentData.workspaces[this.currentWorkspace];

    let connection;
    if (!nameArg) {
      const connections = Object.keys(workspace.connections);
      if (connections.length === 0) {
        console.log(
          chalk.yellow(
            `\nNo connections in workspace "${this.currentWorkspace}"`
          )
        );
        return;
      }

      const { name } = await inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: 'Choose a connection:',
          choices: connections,
        },
      ]);
      connection = workspace.connections[name];
      connection.name = name;
    } else {
      if (!workspace.connections[nameArg]) {
        console.error(
          chalk.red(
            `Connection "${nameArg}" not found in workspace "${this.currentWorkspace}"`
          )
        );
        return;
      }
      connection = workspace.connections[nameArg];
      connection.name = nameArg;
    }

    return SSHUtils.connectToServer(connection);
  }

  async reset() {
    try {
      await fs.unlink(this.configPath);
      this.currentWorkspace = null;
      this._masterPassword = null;
      this._currentData = null;
      console.log(chalk.green('Database reset successfully.'));
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      console.log(chalk.yellow('Database was already empty.'));
    }
  }
}
