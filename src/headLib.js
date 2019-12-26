const EMPTY_STRING = "";
const getHeadLines = function(fileContent, count) {
  const listOfLines = fileContent.split("\n");
  return listOfLines.slice(0, count).join("\n");
};

const readFile = function(path, fs) {
  let content = EMPTY_STRING;
  let err = EMPTY_STRING;
  const isFilePresent = fs.existsSync(path);
  if (isFilePresent) content = fs.readFileSync(path, "utf8");
  else err = `head : ${path} No such file or directory`;
  return { err, content };
};

const parseArgs = function(args) {
  let parsedArgs = { count: 10 };
  let index = 0;

  while (index < args.length) {
    if (args[index] === "-n") {
      const usrCount = +args[index + 1];
      if (Number.isInteger(usrCount) && usrCount >= 1)
        parsedArgs.count = usrCount;
      else parsedArgs.err = `head: illegal line count -- ${args[index + 1]}`;
      index = index + 2;
    } else {
      parsedArgs.files = args[index];
      index++;
    }
  }

  return parsedArgs;
};

const performHead = function(usrArgs, fs) {
  const parsedArgs = parseArgs(usrArgs);
  if (parsedArgs.err) return { content: EMPTY_STRING, err: parsedArgs.err };
  const { err, content } = readFile(parsedArgs.files, fs);
  if (err) return { content: EMPTY_STRING, err };
  const headLines = getHeadLines(content, parsedArgs.count);
  return { content: headLines, err: EMPTY_STRING };
};

module.exports = {
  performHead,
  getHeadLines,
  readFile,
  parseArgs
};
