// ssh-utils.js
import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import chalk from 'chalk';
import { CONFIG, EXCLUDED_SSH_FILES } from '../config.js';

export class SSHUtils {
  static async getAvailableSSHKeys() {
    try {
      const files = await fs.readdir(CONFIG.sshPath);
      return files
        .filter((file) => !EXCLUDED_SSH_FILES.some((test) => test(file)))
        .map((key) => ({
          name: key,
          value: path.join(CONFIG.sshPath, key),
        }));
    } catch (error) {
      console.error(chalk.red('Error reading .ssh directory:', error.message));
      return [];
    }
  }

  static connectToServer(connection) {
    let sshArgs = ['-t'];

    if (connection.port !== CONFIG.defaultPort) {
      sshArgs.push('-p', connection.port.toString());
    }

    if (connection.keyPath) {
      sshArgs.push('-i', connection.keyPath);
    }

    sshArgs.push(`${connection.username}@${connection.host}`);

    console.log(chalk.green(`\nConnecting to ${connection.name}...`));

    const sshProcess = spawn('ssh', sshArgs, {
      stdio: 'inherit',
    });

    sshProcess.on('error', (err) => {
      console.error(chalk.red('SSH process error:'), err);
    });

    sshProcess.once('exit', (code, signal) => {
      console.log(
        chalk.yellow(`SSH process exited with code ${code} signal ${signal}`)
      );
    });

    return sshProcess;
  }
}
