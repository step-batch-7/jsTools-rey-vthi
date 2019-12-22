const formatHeadLine = function(lines) {
  return lines.join("\n");
};

const getHeadLines = function(fileContent) {
  const listOfLines = fileContent.split("\n");
  return listOfLines.slice(0, 10);
};
const readFile = function(path, reader, fileExists) {
  if (fileExists(path)) return reader(path);
  throw new Error("head: No such a file or directory");
};
const extractFileName = function(usrArgs) {
  return { fileName: usrArgs.slice(2) };
};
module.exports = { formatHeadLine, getHeadLines, readFile, extractFileName };