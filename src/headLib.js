const EMPTY_STRING = '';

const getHeadLines = function(fileContent, count) {
  const from = 0;
  const listOfLines = fileContent.split('\n');
  return listOfLines.slice(from, count).join('\n');
};

const FILE_ERRORS = {
  ENOENT: 'head: No such file or directory',
  EACCES: 'head: Permission denied',
  EISDIR: 'head: Is a directory'
};

const isValidCount = function(count) {
  const zero = 0;
  return Number.isInteger(+count) && +count > zero;
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
  return file?createReadStream(file): stdin;
};

const performHead = function(usrArgs, createReadStream, stdin, onComplete) {
  const parsedArgs = parseArgs(usrArgs);
  if (parsedArgs.err) {
    return onComplete({ content: EMPTY_STRING, err: parsedArgs.err });
  }
  const inputStream = pickStream(parsedArgs.file, createReadStream, stdin);
  readStreamLines(inputStream, parsedArgs.count, onComplete);
};


const readStreamLines = function(reader, count, onComplete) {
  const content = EMPTY_STRING;
  const noLines = 0;
  let headLinesLeft = count;
  const onData =(chunk) => {
    const currentChunkLineCount = chunk.trim().split('\n').length;
    onComplete({content: getHeadLines(chunk, headLinesLeft), err: ''});
    headLinesLeft=headLinesLeft-currentChunkLineCount;
    if(headLinesLeft <= noLines){
      reader.destroy();
    }
  };
  const onError = error => onComplete({err: FILE_ERRORS[error.code], content});
  

  reader.setEncoding('utf8');
  reader.on('data', onData);
  reader.on('error', onError);
};


module.exports = performHead;
