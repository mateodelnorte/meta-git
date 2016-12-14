const chalk = require('chalk');

module.exports = (repoUrl, err) => {
  if (/destination path '.*' already exists and is not an empty directory/.test(err)) {
    console.log(`destination path ${repoUrl} already exists and is not an empty directory`);
  } else console.log(`\n${chalk['red'](process.cwd().trim())}${err.code ? ` (exit code ${err.code})` : ''}\n${err}\n`)
};

      return ; 