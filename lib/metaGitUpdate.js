const debug = require('debug')('meta-git:update');
const exec = require('meta-exec');
const fs = require('fs');
const getMetaFile = require('get-meta-file');
const path = require('path');
const util = require('util');


function getSubmodulePaths(gitmodulesPath = '.gitmodules') {
  try {
    // Read the .gitmodules file
    if(!fs.existsSync(gitmodulesPath)) {
      return [];
    }
    const content = fs.readFileSync(gitmodulesPath, 'utf8');

    // Parse the content using regular expressions
    const submoduleRegex = /\[submodule "([^"]+)"\]\s*path = (.+)/g;
    const submodulePaths = [];
    let match;

    while ((match = submoduleRegex.exec(content)) !== null) {
      const path = match[2].trim();
      submodulePaths.push(path);
    }

    return submodulePaths;
  } catch (error) {
    console.error('Error reading or parsing .gitmodules file:', error);
    return [];
  }
}


module.exports = (options = {}) => {
  const meta = getMetaFile({ confirmInMetaRepo: true, warn: false });
  if (!meta) return;

  const submodulePaths = getSubmodulePaths();
  
  // Filter out existing projects but allow empty directories if they are also submodules
  const missing = Object.keys(meta.projects).filter(name => {
    if (fs.existsSync(name)) {
      const stat = fs.lstatSync(name);
      if (stat.isDirectory() && submodulePaths.includes(name)) {
        const files = fs.readdirSync(name);
        return files.length === 0;
      }
      return false;
    }
    return true;
  });

  if (options.dryRun) {
    if (missing.length) {
      const printMissing = () =>
        util.inspect(
          missing.reduce((memo, name) => {
            memo[name] = meta.projects[name];
            return memo;
          }, {})
        );
      return console.warn(
        `\n*** the following repositories have been added to .meta but are not currently cloned locally:\n\*** ${printMissing()}\n*** type 'meta git update' to correct.`
      );
    } else if (options.log) {
      return console.warn(
        '\n***meta update: all repositories from .meta are cloned and present'
      );
    }
  } else {
    if (!missing.length) {
      if (options.log)
        console.log('all repositories in .meta are cloned locally');
      return;
    }
    if (options.log) {
      console.log('\n\n cloning missing repositories\n');
    }
    (function next(err) {
      if (err) throw err;
      if (missing.length) {
        const name = missing.pop();
        exec(
          {
            cmd: `git clone ${meta.projects[name]} ${name}`,
            displayDir: path.resolve(name),
          },
          next
        );
      }
    })();
  }
};
