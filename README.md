# Grocery Price Tracker - gropt

Command-line application for tracking grocery prices across logged purchases.

## Linting and Formatting

The project uses *JavaScript Standard Style* for linting and formatting. See [standardjs](https://standardjs.com/). It is available as the `standard` package development dependency in `package.json`. If using VS Code, you can install the `standard.vscode-standard` extension and enable `Auto Fix On Save`.

## Setup

The following sequence of commands will allow you to run the command as a binary executable:

```bash
npm install
npm link
chmod u+x src/bin/cmd.js
gropt --help
```