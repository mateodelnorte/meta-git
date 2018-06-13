module.exports.register = (program) => {
  program
    .command('git', 'manage your meta repo and child git repositories')
}

module.exports.update = (options) => {
  require('./lib/metaGitUpdate')(options);
}
