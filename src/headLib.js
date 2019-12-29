const EMPTY_STRING = '';

const getHeadLines = function(fileContent, count) {
  const from = 0;
  const listOfLines = fileContent.split('\n');
  return listOfLines.slice(from, count).join('\n');
};

const respondedWithContent = function(count, displayResult, content) {
  const headLines = getHeadLines(content, count);
  displayResult({ err: '', content: headLines });
};

const fileErrors = {
  ENOENT: 'head: No such file or directory',
  EACCES: 'head: Permission denied',
  EISDIR: 'head: Is a directory'
};

const respondedWithError = function(displayResult, err) {
  displayResult({ err: fileErrors[err.code], content: '' });
};

const readStreamLines = function(args, reader, displayResult) {
  reader.setEncoding('utf8');
  reader.on('data', respondedWithContent.bind(null, args.count, displayResult));
  reader.on('error', respondedWithError.bind(null, displayResult));
};

const isValidCount = function(count) {
  return Number.isInteger(+count);
};

const parseArgs = function(args) {
  const parsedArgs = { count: 10 };
  const step = 1;
  if (args.includes('-n')) {
    const option = args.indexOf('-n');
    parsedArgs.count = +args[option + step];
    if (!isValidCount(parsedArgs.count)) {
      parsedArgs.err = `head: illegal line count -- ${args[option + step]}`;
    }
  }
  parsedArgs.file = args[args.length - step];
  return parsedArgs;
};

const pickStream = function(file, createReadStream, stdin) {
  return file ? createReadStream(file) : stdin;
};

const performHead = function(
  usrArgs,
  { createReadStream, stdin },
  displayResult
) {
  const parsedArgs = parseArgs(usrArgs);
  if (parsedArgs.err) {
    return displayResult({ content: EMPTY_STRING, err: parsedArgs.err });
  }
  const inputStream = pickStream(parsedArgs.file, createReadStream, stdin);
  readStreamLines(parsedArgs, inputStream, displayResult);
};

module.exports = {
  performHead,
  getHeadLines,
  parseArgs
};
