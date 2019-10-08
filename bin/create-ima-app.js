#!/usr/bin/env node

const path = require('path');
const execa = require('execa');
const chalk = require('chalk');
const argv = require('yargs').argv;

if (argv._.length === 0) {
  console.log(`
Please specify your new project directory with an optional example: 
  ${chalk.blue('create-ima-app')} ${chalk.green(
    '<project-directory>'
  )} [--example=[todos|feed]]

For example:
  ${chalk.blue('create-ima-app')} ${chalk.green('my-ima-application')}`);

  process.exit(0);
}

execa.sync(
  'node',
  [path.resolve(__dirname, '../scripts/create.js'), ...process.argv.slice(2)],
  {
    stdio: 'inherit'
  }
);
