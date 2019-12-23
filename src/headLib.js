const formatHeadLine = function(lines) {
  return lines.join("\n");
};

const getHeadLines = function(fileContent, numOfLine) {
  const listOfLines = fileContent.split("\n");
  return listOfLines.slice(0, numOfLine);
};

const readFile = function(path, fs) {
  if (!fs.fileExists(path))
    return { content: "head : No such a file or directory", err: true };
  return { content: fs.readFile(path, fs.encoding) };
};

const validateNumber = function(index, args, argsInfo) {
  if (Number.isInteger(+args[index])) argsInfo.count = +args[index];
  else argsInfo.isValidOption = false;
};

const parseArgs = function(args) {
  let parsedArgs = { count: 10, isValidOption: true };
  let index = 0;
  while (index < args.length) {
    if (args[index] === "-n") {
      validateNumber(index + 1, args, parsedArgs);
      index = index + 2;
    } else {
      parsedArgs.files = args[index];
      index++;
    }
  }
  if (parsedArgs.isValidOption) return parsedArgs;
  throw Error("head: illegal line count");
};

const performHead = function(usrArgs, fs) {
  const parsedArgs = parseArgs(usrArgs);

  const fileContents = readFile(parsedArgs.files, fs);
  if (fileContents.err) return fileContents;
  const headLines = getHeadLines(fileContents.content, parsedArgs.count);
  return { content: formatHeadLine(headLines) };
};

module.exports = {
  performHead,
  formatHeadLine,
  getHeadLines,
  parseArgs,
  readFile
};
