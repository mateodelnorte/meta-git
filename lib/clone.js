const debug = require('debug')('meta-git:clone');
const parseError = require('./parseError');
const spawn = require('child_process').spawn;
const toReadStream = require('spawn-to-readstream');

module.exports = (repoUrl, dir, cb) => {

  debug(`cloning into ${repoUrl} at ${dir}`);

  const parse = parseError.bind(this, repoUrl);

  toReadStream(spawn('git', ['clone', repoUrl, dir], { env: process.env }))
    .on('error', parse)
    .on('end', () => {
      console.log(`git clone ${repoUrl} complete`);
      cb();
    }).on('data', (data) => {
      console.log(data.toString());
    });

};