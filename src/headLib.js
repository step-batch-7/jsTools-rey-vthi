const EMPTY_STRING = '';

const getHeadLines = function(fileContent, count) {
  const from = 0;
  const listOfLines = fileContent.split('\n');
  return listOfLines.slice(from, count).join('\n');
};

const respondedWithContent = function(count, onComplete, content) {
  const headLines = getHeadLines(content, count);
  onComplete({ err: EMPTY_STRING, content: headLines });
};

const fileErrors = {
  ENOENT: 'head: No such file or directory',
  EACCES: 'head: Permission denied',
  EISDIR: 'head: Is a directory'
};

const respondedWithError = function(onComplete, err) {
  onComplete({ err: fileErrors[err.code], content: EMPTY_STRING });
};

const readStreamLines = function(args, reader, onComplete) {
  let content = EMPTY_STRING;
  const count = args.count;
  reader.setEncoding('utf8');
  reader.on('data', data => { content = content + data;});
  reader.on('end', () => respondedWithContent(count, onComplete, content));
  reader.on('error', respondedWithError.bind(null, onComplete));
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

const performHead = function(usrArgs, inputStreams, onComplete) {
  const { createReadStream, stdin } = inputStreams;
  const parsedArgs = parseArgs(usrArgs);
  if (parsedArgs.err) {
    return onComplete({ content: EMPTY_STRING, err: parsedArgs.err });
  }
  const inputStream = pickStream(parsedArgs.file, createReadStream, stdin);
  readStreamLines(parsedArgs, inputStream, onComplete);
};

module.exports = {
  performHead,
  getHeadLines,
  parseArgs
};
