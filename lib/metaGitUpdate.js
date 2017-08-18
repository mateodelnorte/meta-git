const debug = require('debug')('meta-git:update');
const exec = require('meta-exec');
const getMetaFile = require('get-meta-file');
const fs = require('fs');
const path = require('path');
const util = require('util');

module.exports = (options) => {

  options = options || {};

  const meta = getMetaFile({ confirmInMetaRepo: true, warn: false });

  if (options.dryRun && ! meta) return;

  const projects = meta.projects;
  let folders = Object.keys(projects);

  var folder = null;

  // remove folders that already exist
  folders = folders.filter((folder) => {
    return ! fs.existsSync(path.resolve(folder));
  });

  if (options.dryRun) {
    
    function printMissing () {
      var missing = {};
      folders.forEach((folder) => {
        missing[folder] = projects[folder];
      });
      return util.inspect(missing);
    }

    if (folders.length === 0 && options.log) return console.warn('\n***meta update: all repositories from .meta are cloned and present');
    else if (folders.length) return console.warn(`\n*** the following repositories have been added to .meta but are not currently cloned locally:\n\*** ${printMissing()}\n*** type 'meta git update' to correct.`);

  } else {

    if ( ! folders.length) return console.log('all repositories in .meta are cloned locally');

    console.log('\n\n cloning missing repositories\n');

    function child (err) {
      if (err) throw err;
      
      if ( ! folders.length) return 0;

      folder = folders.pop()

      const gitUrl = projects[folder];

      exec({ cmd: `git clone ${gitUrl} ${folder}`, displayDir: path.join(process.cwd(), folder) },  (err) => {
        if (err) throw err;

        child();

      });

    }

    child();


  }

}