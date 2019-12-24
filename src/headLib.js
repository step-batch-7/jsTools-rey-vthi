const getHeadLines = function(fileContent) {
  const listOfLines = fileContent.split("\n");
  return listOfLines.slice(0, 10).join("\n");
};

const readFile = function(path, fs) {
  if (!fs.fileExists(path))
    return { err: `head : ${path} No such file or directory` };
  return { content: fs.readFile(path, fs.encoding) };
};

const performHead = function(usrArgs, fs) {
  const fileContent = readFile(usrArgs[0], fs);
  if (fileContent.err) return fileContent;
  const headLines = getHeadLines(fileContent.content);
  return { content: headLines };
};

module.exports = {
  performHead,
  getHeadLines,
  readFile
};
