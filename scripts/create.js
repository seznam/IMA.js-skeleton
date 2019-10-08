const execa = require('execa');
const fs = require('fs');
const fsx = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const argv = require('yargs').argv;

const dir = argv._[0];
const example = argv.example ? argv.example : 'hello';

createImaApp(dir, example);

function createImaApp(dirName, exampleName) {
  console.log(
    `\nCreating new IMA.js app inside ${chalk.green(dirName)} directory...\n`
  );

  if (!['todos', 'hello', 'feed'].includes(example)) {
    console.log(chalk.red('Aborting... Example must be one of [todos|feed].'));
    process.exit(0);
  }

  const projName = dirName.split(path.sep).pop();
  const appRoot = path.resolve(dirName.toString());
  const tplRoot = path.join(__dirname, '../template');

  if (!fs.existsSync(dirName)) {
    try {
      console.log(`Creating basic directory structure...`);
      fsx.copySync(tplRoot, appRoot);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  } else {
    console.log(
      chalk.red(`Aborting... the directory ${dirName} already exists.\n`)
    );
    process.exit(0);
  }

  // Overwrite package.json with new name
  const pkgJsonPath = path.join(appRoot, 'package.json');
  const pkgJson = require(pkgJsonPath);

  pkgJson.name = projName;
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));

  // Copy example files into ./app directory
  if (exampleName !== 'hello') {
    console.log(`Copying ${chalk.cyan(exampleName)} example files...`);
  }

  const exampleRoot = path.resolve(
    `./node_modules/ima-examples/${exampleName}`
  );
  fsx.copySync(exampleRoot, path.join(appRoot, 'app'));

  // Run npm install
  console.log(
    `Running ${chalk.cyan(
      'npm install'
    )} inside app directory, this might take a while...\n`
  );

  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  execa.sync(npm, ['install'], {
    stdio: 'inherit',
    cwd: appRoot
  });

  // Init git repo
  console.log('\nInitializing git repository...');
  execa.sync('git', ['init'], { cwd: appRoot });

  // Show final info
  console.log(`
${chalk.green('Success!')} Created ${chalk.cyan(projName)} inside ${chalk.green(
    appRoot
  )} directory.
From there you can run several commands:

  ${chalk.cyan('npm run test')}
    To start test runners.

  ${chalk.cyan('npm run lint')}
    To run eslint on your application source files.

  ${chalk.cyan('npm run dev')}
    To start development server.

  ${chalk.cyan('npm run build')}
    To build the application.

  ${chalk.cyan('npm run build:spa')}
    To build SPA version of the application.

  ${chalk.cyan('npm run start')}
    To start IMA.js server.

We suggest that you start with:

  ${chalk.cyan('cd')} ${dirName}
  ${chalk.cyan('npm run dev')}
`);
}
