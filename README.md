# MySSH CLI

A **MySSH CLI** tool for securely managing SSH connections and workspaces with built-in encryption, interactive prompts, and a master password. This CLI makes it easy to store and organize your SSH connections across multiple workspaces, protecting sensitive information with AES-256-GCM encryption.

## Table of contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Global installation (Recommended)](#global-installation-recommended)
  - [Local installation](#local-installation)
- [Usage](#usage)
  - [First-time setup](#first-time-setup)
  - [Available commands](#available-commands)
  - [Examples](#examples)
- [How it works](#how-it-works)
  - [Master password](#master-password)
  - [Encrypted storage](#encrypted-storage)
  - [Workspaces](#workspaces)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Master password**: Secure all your SSH connection details behind one master password.
- **AES-256-GCM encryption**: All saved data is encrypted at rest.
- **Multiple workspaces**: Organize connections into separate workspaces for different projects or environments.
- **Interactive prompts**: Easy-to-use menu system powered by [Inquirer](https://www.npmjs.com/package/inquirer).
- **SSH integration**: Quickly connect to your servers using stored credentials and SSH keys.
- **Reset function**: Easily wipe all stored data if you need to start over.

---

## Prerequisites

- **Node.js** (version 14 or later) and **npm** installed.
- A valid **SSH** client installed on your system (e.g., OpenSSH).

---

## Installation

### Global installation (recommended)

1. **Clone or download** the repository to your local machine.
2. Navigate to the project root folder:
   ```bash
   cd myssh-cli
   ```
3. Install it globally:
   ```bash
   npm install -g .
   ```
4. Now you can run:
   ```bash
   myssh
   ```

### Local installation

Alternatively, you can install and run the tool locally:

1. From your project root folder, install dependencies:
   ```bash
   npm install
   ```
2. Run the CLI locally:
   ```bash
   npm start
   ```
   or
   ```bash
   node src/index.js
   ```

---

## Usage

Once installed, run:

```bash
myssh
```

This opens an interactive menu with the following options:

1. **Connect**  
   Select or specify a connection to open an SSH session.
2. **Add connection**  
   Create a new SSH connection entry within your current workspace.
3. **List connections**  
   Display all connections in the current workspace.
4. **Switch workspace**  
   Choose a different workspace or create a new one.
5. **Quit**  
   Exit the CLI.

### First-time setup

- On your **very first run**, you will be asked to create a master password if none exists.  
- The tool will also invite you to create your first workspace.  
- Once set, the master password encrypts your data, so be sure to remember it.

### Available commands

If you run `myssh` with arguments, you have the following options:

- **`myssh --reset`** or **`myssh -r`**  
  Resets all stored data, removing the encrypted file from your system.  
  Use with caution, as all saved connections will be lost.

### Examples

- **Create a new connection**  
  1. Run `myssh`  
  2. Select “Add connection”  
  3. Provide the requested info (name, host, username, SSH key path, port)  
  4. Your new connection is stored securely in the current workspace.

- **Connect to a server**  
  1. Run `myssh`  
  2. Select “Connect”  
  3. Choose the connection name from the list  
  4. An SSH session is launched in your terminal.

- **Switch workspace**  
  1. Run `myssh`  
  2. Select “Switch workspace”  
  3. Pick an existing workspace or create a new one

---

## How it works

### Master password

The first time you run the CLI (or if no config file is found), you are prompted to **create a new master password**. This password is used to encrypt and decrypt your SSH connection data.  
- Must be at least 8 characters long.  
- The tool will ask for it on subsequent runs to decrypt your existing connections.

### Encrypted storage

All data is stored in a JSON file (by default `~/.ssh-manager`) but in an **AES-256-GCM** encrypted format. This means:
- Even if someone gets access to your `.ssh-manager` file, they cannot read your SSH credentials without your master password.  
- Encryption and decryption are handled via Node’s built-in `crypto` module.

### Workspaces

Workspaces help you organize different sets of SSH connections. For example, you might have:  
- A `production` workspace with your production servers.  
- A `staging` workspace for QA or test environments.  
- A `personal` workspace for your private servers.

You can create or switch between workspaces using the menu. Each workspace keeps its own set of connections.

---

## FAQ

**1. What happens if I forget my master password?**  
Unfortunately, if you forget your master password, there is no way to recover your existing encrypted data. You can reset the database (`myssh --reset`) to start over with a new master password, but you will lose all previously stored connections.

**2. Where is the data stored?**  
By default, the CLI stores an encrypted JSON file in your home directory, named `.ssh-manager`. You can change this path by modifying the config.

**3. Can I use password-based SSH instead of keys?**  
Currently, the CLI is designed to store hostnames, ports, usernames, and SSH keys. You can manually connect using password-based SSH after the session starts, but the CLI does not store SSH passwords. For better security, we recommend SSH keys.

**4. How do I uninstall the CLI?**  
- Remove the global installation: `npm uninstall -g myssh-cli`.  
- Delete the `.ssh-manager` file in your home directory if you want to remove all stored data.

---

## Contributing

Contributions are welcome! To get started:

1. **Fork** this repository and clone it locally.
2. **Create** a new branch for your feature or fix.
3. **Commit** your changes and push them to your fork.
4. Open a **pull request** describing your changes.

Please ensure your code is well tested and follows a consistent style. Feel free to open an issue for any questions or suggestions.

---

## License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for more details.

---

### Enjoy MySSH CLI!

If you have any feedback, questions, or issues, feel free to open a GitHub issue or submit a pull request. Happy SSH-ing!