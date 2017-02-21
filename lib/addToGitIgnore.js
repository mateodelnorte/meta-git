const fs = require('fs');

module.exports = (gitIgnorePath, folder, options) => {

  options = options || { log: false };

  if (options.log) console.log(`adding ${folder} to .gitignore at ${gitIgnorePath}`);

  try {
    fs.statSync(gitIgnorePath);
  } catch (err) {
    if (err.message === `ENOENT: no such file or directory, stat '${gitIgnorePath}'`) {
      console.warn(`${gitIgnorePath} does not exists. Creating it now.`);
      fs.closeSync(fs.openSync(gitIgnorePath, 'a'));
    }
  }
console.log(gitIgnorePath)
  let contents = fs.readFileSync(gitIgnorePath).toString()

  contents += `${folder}\n`;

  fs.writeFileSync(gitIgnorePath, contents);

};