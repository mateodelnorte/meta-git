const chalk = require('chalk');
const debug = require('debug')('meta-git:clone');
const parseError = require('./parseError');
const path = require('path');
const execSync = require('child_process').execSync;
const toReadStream = require('spawn-to-readstream');

module.exports = (repoUrl, dir, cb) => {

  debug(`cloning ${repoUrl} to ${dir}`);

  const parse = parseError.bind(this, repoUrl);

  const cmd = `git clone ${repoUrl} ${dir}`;

  var code = null;

  try {

    console.log(`\n${chalk.cyan(path.basename(dir))}:`)

    code = execSync(cmd, { env: process.env, stdio: 'inherit' });

  } catch (err) {
    // a cmd error isnt a loop error,
    // we just want to output the cmd's output
    let errorMessage = `${chalk.red(path.basename(dir))} exited with error: ${err.toString()}`;
    console.error(errorMessage);
    return cb(null, { error: parse(errorMessage) });
  }

  if (code) {
    let errorMessage = `${chalk.red(path.basename(dir))} exited with code: ${code}`;
    console.error(errorMessage);
    return cb(null, { err: parse(errorMessage) });
  } 

  let success = chalk.green(`${path.basename(dir)} ✓`);

  console.log(success);
  
  return cb(null, { output: success });

};