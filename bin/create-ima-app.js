#!/usr/bin/env node

const path = require('path');
const execa = require('execa');
const chalk = require('chalk');
const argv = require('yargs').argv._;

if (argv.length === 0) {
  console.log(`
Please specify your new project directory: 
  ${chalk.blue('create-ima-app')} ${chalk.green('<project-directory>')}

For example:
  ${chalk.blue('create-ima-app')} ${chalk.green('my-ima-application')}`);

  process.exit(0);
}

execa.sync('node', [path.resolve(__dirname, '../scripts/create.js'), ...argv], {
  stdio: 'inherit'
});
