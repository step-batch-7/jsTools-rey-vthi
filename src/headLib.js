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

const illegalOptionMsg = function(option) {
  return `head: illegal option -- ${option}\nusage: head [-n lines | -c bytes] [file ...]`;
};

const illegalCount = function(count) {
  return `head: illegal line count -- ${count}`;
};

const getCount = function(option) {
  return option
    .split("")
    .slice(2)
    .join("");
};

const validateAdjacentPair = function(option, parsedArgs) {
  const count = getCount(option);
  if (option[1] != "n") parsedArgs.err = illegalOptionMsg(option[1]);
  if (!Number.isInteger(+count))
    parsedArgs.err = `head: illegal line count -- ${count}`;
  else parsedArgs.count = +count;
  return parsedArgs;
};

const validateCount = function(count, parsedArgs) {
  if (Number.isInteger(+count) && +count >= 1) parsedArgs.count = +count;
  else parsedArgs.err = illegalCount(count);
  return parsedArgs;
};

const parseArgs = function(args) {
  let parsedArgs = { count: 10 };
  let index = 0;
  while (index < args.length) {
    if (args[index][0] === "-") {
      if (args[index].length > 2)
        parsedArgs = validateAdjacentPair(args[index], parsedArgs);
      else {
        parsedArgs = validateCount(args[index + 1], parsedArgs);
        index++;
      }
    } else parsedArgs.files = args[index];
    index++;
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
