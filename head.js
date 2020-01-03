const { stdin, stderr, stdout } = process;
const { createReadStream } = require('fs');
const  performHead  = require('./src/headLib');

const main = function() {
  const from = 2;
  const usrArgs = process.argv.slice(from);
  const displayResult = function(result) {
    stdout.write(result.content);
    stderr.write(result.err);
  };
  performHead(usrArgs, createReadStream, stdin, displayResult);
};
main();
