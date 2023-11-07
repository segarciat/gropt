# Grocery Price Tracker - gropt

Command-line application for tracking grocery prices across logged purchases.

## Linting and Formatting

The project uses *JavaScript Standard Style* for linting and formatting. See [standardjs](https://standardjs.com/). It is available as the `standard` package development dependency in `package.json`. If using VS Code, you can install the `standard.vscode-standard` extension and enable `Auto Fix On Save`.

## Setup

The following sequence of commands will allow you to run the command as a binary executable:

```bash
npm install
npm link
chmod u+x src/bin/cmd.ts
# Create docker container with Postgres database.
docker compose up -d
# Schema migrations; notice the intentional space at beginning of line to prevent recording command in shell history.
 DATABASE_URL=postgres://<USERNAME>:<PASSWORD>@<host>:<port>/<database> npm run migrate up
gropt --help
```

## Testing

The following test commands are available:

```bash
# Run only unit tests.
npm run test:unit

# Run only integration tests.
npm run test:integration

# Run all tests (unit and integration).
npm test
```