module.exports.register = (program) => {

  program
    .command('git', 'manage your meta repo and child git repositories')
    .parse(process.argv);

  require('./bin/meta-git');

}