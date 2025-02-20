import { promises as fs } from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { Encryption } from './encryption.js';

export class WorkspaceUtils {
  static async loadData(configPath, masterPassword) {
    try {
      const fileContent = await fs.readFile(configPath, 'utf8');
      const encryptedData = JSON.parse(fileContent);
      const data = await Encryption.decrypt(encryptedData, masterPassword);

      // Migration des anciens formats de données si nécessaire
      if (data.connections && !data.workspaces) {
        data.workspaces = {
          default: {
            connections: data.connections,
            createdAt: new Date().toISOString(),
          },
        };
        data.lastWorkspace = 'default';
        delete data.connections;
        await this.saveData(configPath, data, masterPassword);
      }

      return data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Retourne une structure par défaut si aucun fichier n'existe
        return {
          workspaces: {},
          lastWorkspace: null,
        };
      }
      if (error.message.includes('authenticate')) {
        throw new Error('Incorrect master password');
      }
      throw error;
    }
  }

  static async createNewWorkspace(configPath, data, masterPassword) {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'New workspace name:',
        validate: (input) => {
          if (input.length === 0) return 'Name cannot be empty';
          if (data.workspaces[input]) return 'Workspace already exists';
          return true;
        },
      },
    ]);

    if (!data.workspaces) {
      data.workspaces = {};
    }

    data.workspaces[name] = {
      connections: {},
      createdAt: new Date().toISOString(),
    };

    data.lastWorkspace = name;
    await this.saveData(configPath, data, masterPassword);
    console.log(chalk.green(`Workspace "${name}" created and selected.`));
    return name;
  }

  static async saveData(configPath, data, masterPassword) {
    const encrypted = await Encryption.encrypt(data, masterPassword);
    await fs.writeFile(configPath, JSON.stringify(encrypted, null, 2));
  }

  static async selectWorkspace(configPath, data, masterPassword) {
    if (!data.workspaces || Object.keys(data.workspaces).length === 0) {
      console.log(
        chalk.yellow('\nNo workspaces found. Creating first workspace...')
      );
      return await this.createNewWorkspace(configPath, data, masterPassword);
    }

    const { workspace } = await inquirer.prompt([
      {
        type: 'list',
        name: 'workspace',
        message: 'Choose a workspace:',
        choices: [
          ...Object.keys(data.workspaces),
          new inquirer.Separator(),
          '+ Create new workspace',
        ],
      },
    ]);

    if (workspace === '+ Create new workspace') {
      return await this.createNewWorkspace(configPath, data, masterPassword);
    }

    data.lastWorkspace = workspace;
    await this.saveData(configPath, data, masterPassword);
    console.log(chalk.green(`Workspace "${workspace}" selected.`));
    return workspace;
  }
}
