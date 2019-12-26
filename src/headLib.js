const getHeadLines = function(fileContent, count) {
  const listOfLines = fileContent.split("\n");
  return listOfLines.slice(0, count).join("\n");
};

const readFile = function(path, fs) {
  if (!fs.existsSync(path))
    return { err: `head : ${path} No such file or directory`, content: "" };
  return { content: fs.readFileSync(path, "utf8"), err: "" };
};

const validateNumber = function(index, args, argsInfo) {
  const usrNumber = +args[index];
  Number.isInteger(usrNumber)
    ? (argsInfo.count = usrNumber)
    : (argsInfo.isValidOption = false);
  return argsInfo;
};

const parseArgs = function(args) {
  const parsedArgs = { count: 10, isValidOption: true };
  let updatedArgs = parsedArgs;
  let index = 0;
  while (index < args.length) {
    if (args[index] === "-n") {
      updatedArgs = validateNumber(index + 1, args, parsedArgs);
      index = index + 2;
    } else {
      updatedArgs.files = args[index];
      index++;
    }
  }
  if (updatedArgs.isValidOption) return updatedArgs;
  throw Error(`head: illegal line count`);
};

const performHead = function(usrArgs, fs) {
  const parsedArgs = parseArgs(usrArgs);
  const fileContent = readFile(parsedArgs.files, fs);
  if (fileContent.err != "") return fileContent;
  const headLines = getHeadLines(fileContent.content, parsedArgs.count);
  return { err: "", content: headLines };
};

module.exports = {
  performHead,
  getHeadLines,
  readFile,
  parseArgs
};
