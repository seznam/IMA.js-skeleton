const fs = require('fs');
const fsx = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const argv = require('yargs').argv;

createImaApp(argv._[0], 'Hello World');

function createImaApp(dirName, example) {
  console.log(
    `\nCreating new IMA.js application inside ${chalk.green(
      dirName
    )} directory...\n`
  );

  const appRoot = path.resolve(dirName.toString());
  const tplRoot = path.join(__dirname, '../template');

  if (!fs.existsSync(dirName)) {
    try {
      fsx.copySync(tplRoot, appRoot);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  } else {
    console.log(
      chalk.red(`Aborting... the directory ${dirName} already exists.\n`)
    );
    process.exit(1);
  }

  // Download example and install dependencies
  console.log(`Downloading ${chalk.blue(example)} example...`);
  console.log(
    `Running ${chalk.blue(
      'npm install'
    )} in project directory, this might take couple of minutes...`
  );
}
