const { stdin, stderr, stdout } = process;
const { createReadStream } = require('fs');
const { performHead } = require('./src/headLib');

const main = function() {
  const usrArgsFrom = 2;
  const displayResult = function(result) {
    stdout.write(result.content);
    stderr.write(result.err);
  };
  const inputStream = { createReadStream, stdin };
  performHead(process.argv.slice(usrArgsFrom), inputStream, displayResult);
};
main();
