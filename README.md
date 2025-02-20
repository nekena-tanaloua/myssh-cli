# MySSH CLI

MySSH CLI is a lightweight, secure, and fast command-line tool designed to manage your SSH connections and workspaces effortlessly. Born out of the need to handle multiple SSH accesses daily without relying on expensive third-party solutions, MySSH CLI offers a simple, customizable, and open alternative that adapts perfectly to your workflow.

## Table of contents

- [Genesis of the project](#genesis-of-the-project)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Global installation (recommended)](#global-installation-recommended)
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

## Genesis of the project

In my daily routine, managing multiple SSH connections was becoming cumbersome. While I had been using paid software, I found that it didn’t fully align with my workflow. Wanting a more streamlined and efficient solution, I decided to develop a custom CLI tool tailored to my needs. MySSH CLI was born as a way to manage SSH access quickly, securely, and with full customization to fit my workflow perfectly.

---

## Features

- **Master password:** Secure all your SSH connection details behind one master password.
- **AES-256-GCM encryption:** All saved data is encrypted at rest to protect your sensitive information.
- **Multiple workspaces:** Organize connections into separate workspaces for different projects or environments.
- **Interactive prompts:** Enjoy an easy-to-use menu system powered by [Inquirer](https://www.npmjs.com/package/inquirer).
- **SSH integration:** Quickly connect to your servers using stored credentials and SSH keys.
- **Reset function:** Easily wipe all stored data if you need to start over.

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
4. Run the CLI:
   ```bash
   myssh
   ```

### Local installation

Alternatively, you can install and run the tool locally:

1. From the project root folder, install dependencies:
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

Once installed, launch the CLI by running:

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

- On your **first run**, you'll be prompted to create a master password if one doesn't exist.
- The tool will also guide you in creating your first workspace.
- The master password encrypts your data, so make sure to remember it.

### Available commands

When running `myssh` with command-line arguments, you can use:

- **`myssh --reset`** or **`myssh -r`**  
  Resets all stored data by removing the encrypted file from your system.  
  *Warning: This will permanently erase all saved connections.*

### Examples

- **Creating a new connection**  
  1. Run `myssh`.
  2. Select “Add connection”.
  3. Provide the required information (name, host, username, SSH key path, port).
  4. Your new connection is securely stored in the current workspace.

- **Connecting to a server**  
  1. Run `myssh`.
  2. Select “Connect”.
  3. Choose the connection from the list.
  4. An SSH session will launch in your terminal.

- **Switching workspaces**  
  1. Run `myssh`.
  2. Select “Switch workspace”.
  3. Choose an existing workspace or create a new one.

---

## How it works

### Master password

Upon first launch (or if no configuration file is found), you will be prompted to **create a master password**. This password is used to encrypt and decrypt your SSH connection data.
- Must be at least 8 characters long.
- You will need to enter the master password on subsequent runs to access your encrypted data.

### Encrypted storage

All data is stored in a JSON file (by default `~/.ssh-manager`) in an **AES-256-GCM** encrypted format. This ensures:
- Even if someone gains access to your `.ssh-manager` file, they cannot read your SSH credentials without the master password.
- Encryption and decryption are handled via Node’s built-in `crypto` module.

### Workspaces

Workspaces allow you to organize different sets of SSH connections. For example, you might have:
- A `production` workspace for live servers.
- A `staging` workspace for testing or QA environments.
- A `personal` workspace for private servers.

You can switch between workspaces or create new ones directly from the CLI menu, keeping your connections neatly organized.

---

## FAQ

**1. What happens if I forget my master password?**  
Unfortunately, if you forget your master password, your encrypted data cannot be recovered. You can reset the database using `myssh --reset`, but this will permanently erase all saved connections.

**2. Where is the data stored?**  
By default, MySSH CLI stores an encrypted JSON file in your home directory, named `.ssh-manager`. This path can be modified in the configuration if needed.

**3. Can I use password-based SSH instead of keys?**  
MySSH CLI is designed to store hostnames, ports, usernames, and SSH keys. While you can manually enter a password during an SSH session, the CLI does not store passwords for security reasons. For enhanced security, we recommend using SSH keys.

**4. How do I uninstall MySSH CLI?**  
- Remove the global installation with: `npm uninstall -g myssh-cli`.
- Delete the `.ssh-manager` file from your home directory if you wish to remove all stored data.

---

## Contributing

Contributions are welcome! To get started:

1. **Fork** this repository and clone it locally.
2. **Create** a new branch for your feature or bug fix.
3. **Commit** your changes and push them to your fork.
4. Open a **pull request** describing your changes.

Please ensure your code is well-tested and adheres to the project's coding standards. Feel free to open an issue for any questions or suggestions.

---

## License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for more details.

---

### Enjoy MySSH CLI!

If you have any feedback, questions, or issues, please open a GitHub issue or submit a pull request. Happy SSH-ing! 🚀