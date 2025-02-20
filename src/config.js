import os from 'os';
import path from 'path';

export const CONFIG = {
  defaultConfigPath: '.ssh-manager',
  algorithm: 'aes-256-gcm',
  pbkdf2Iterations: 100000,
  pbkdf2Digest: 'sha256',
  pbkdf2KeyLen: 32,
  sshPath: path.join(os.homedir(), '.ssh'),
  defaultPort: 22,
};

export const EXCLUDED_SSH_FILES = [
  (file) => file.endsWith('.pub'),
  (file) => file.endsWith('.known_hosts'),
  (file) => file.endsWith('.config'),
  (file) => file === 'authorized_keys',
];
