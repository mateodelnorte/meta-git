module.exports.register = (program) => {

  program
    .command('git', 'manage your meta repo and child git repositories');

  require('./bin/meta-git');

}