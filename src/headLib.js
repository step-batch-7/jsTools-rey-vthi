const EMPTY_STRING = '';

const getHeadLines = function(fileContent, count) {
  const from = 0;
  const listOfLines = fileContent.split('\n');
  return listOfLines.slice(from, count).join('\n');
};

const fileErrors = { ENOENT: 'head: No such file or directory' };

const respondedWithContent = function(count, displayResult, content) {
  const headLines = getHeadLines(content, count);
  displayResult({ err: '', content: headLines });
};

const respondedWithError = function(displayResult, err) {
  displayResult({ err: fileErrors[err.code], content: '' });
};

const readFile = function(parsedArgs, createReadStream, displayResult) {
  const reader = createReadStream(parsedArgs.file);
  reader.setEncoding('utf8');
  reader.on(
    'data',
    respondedWithContent.bind(null, parsedArgs.count, displayResult)
  );
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

const performHead = function(usrArgs, readStream, displayResult) {
  const parsedArgs = parseArgs(usrArgs);
  if (parsedArgs.err) {
    return displayResult({ content: EMPTY_STRING, err: parsedArgs.err });
  }
  readFile(parsedArgs, readStream, displayResult);
};

module.exports = {
  performHead,
  getHeadLines,
  parseArgs
};
