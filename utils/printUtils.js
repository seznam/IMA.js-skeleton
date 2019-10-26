const chalk = require('chalk');

function info(content, newLine = false) {
  newLine && console.log('');
  console.log(`${chalk.bold.green('info:')} ${content}`);
}

function error(content, newLine = false) {
  newLine && console.log('');
  console.log(`${chalk.bold.red('error:')} ${content}`);
}

module.exports = {
  info,
  error
};
