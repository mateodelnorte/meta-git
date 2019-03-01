const debug = require('debug')('meta-git:update');
const exec = require('meta-exec');
const fs = require('fs');
const getMetaFile = require('get-meta-file');
const path = require('path');
const util = require('util');
const execSync = require('child_process').execSync;

module.exports = (options = {}, seenProjects = []) => {
  const recursive = process.argv.indexOf('--recursive') >= 0;

  const meta = getMetaFile({ confirmInMetaRepo: true });

  if (!meta) return;

  projects = [];
  needsUpdating = [];
  // Child repos should not try to update a repo that
  // has already been processed by one of its parents.
  // This gives parent repos priority over specifying
  // branch revisions for child repos installed in
  // the same location
  Object.keys(meta.projects).forEach(function(name) {
    if (!seenProjects.includes(path.resolve(name))) {
      projects.push(name);
      seenProjects.push(path.resolve(name));
      //Filter out existing projects if HEAD revision matches the one listed in the meta file.
      if (
        !(
          fs.existsSync(path.join(name, '.git')) &&
          getCommit('HEAD', name) === getCommit(meta.branches[name], name)
        )
      ) {
        needsUpdating.push(name);
      }
    }
  });

  if (options.dryRun) {
    if (needsUpdating.length) {
      const printneedsUpdating = () =>
        util.inspect(
          needsUpdating.reduce((memo, name) => {
            memo[name] = `${meta.projects[name]}#${meta.branches[name]}`;
            return memo;
          }, {})
        );
      return console.warn(
        `\n*** the following repositories have been added to .meta but are not currently cloned locally\n*** or have revision mismatches:\n\*** ${printneedsUpdating()}\n*** type 'meta git update' to correct.`
      );
    } else if (options.log) {
      return console.warn(
        '\n***meta update: all repositories from .meta are cloned and have matching revisions'
      );
    }
  } else {
    if (!needsUpdating.length) {
      if (options.log)
        console.log(
          'all repositories in .meta are cloned locally and have matching revisions'
        );
      return;
    }
    if (options.log) {
      console.log(
        '\n\n cloning repositories that are missing or have revision mismatches\n'
      );
    }

    // update all child repositories before attempting to recursively update each child repositories
    while (needsUpdating.length) {
      const name = needsUpdating.pop();
      module.exports.cloneRepo(meta.projects[name], name, meta.branches[name]);
    }

    if (recursive) {
      projects.forEach(function(name) {
        // To avoid being prompted by getMetaFile for every
        // child repo that is not a meta repo,
        // only recurse into the child repo if it is known
        // to be a meta repo
        if (fs.existsSync(path.join(name, '.meta'))) {
          const cwd = process.cwd();
          process.chdir(name);
          module.exports(options, seenProjects);
          process.chdir(cwd);
        }
      });
    }
  }
};

module.exports.cloneRepo = function(repo, directory, branch) {
  output = null;
  if (!fs.existsSync(path.join(directory, '.git'))) {
    exec(
      {
        cmd: `git clone ${repo} ${directory}`,
        displayDir: path.resolve(directory),
        suppressLogging: true,
      },
      (err, result) => {
        if (err) throw err;
        if (result['output']) output = result['output'];
      },
      err => {
        throw err;
      }
    );
  }

  if (getCommit('HEAD', directory) !== getCommit(branch, directory)) {
    exec(
      {
        cmd: `git checkout ${branch}`,
        dir: directory,
        suppressLogging: true,
      },
      (err, result) => {
        if (err) throw err;
        if (result['output']) output = result['output'];
      },
      err => {
        throw err;
      }
    );
  }
  if (output) console.log(output);
};

getCommit = function(commitish, name) {
  code = execSync(`git rev-parse --verify  ${commitish}^{commit}`, {
    cwd: name,
    env: process.env,
  });
  return code.toString().trim();
};
