module.exports = (repoUrl, err) => {
  if (/destination path '.*' already exists and is not an empty directory/.test(err)) {
    console.log(`destination path ${repoUrl} already exists and is not an empty directory`);
  } else console.log(err)
};