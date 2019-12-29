const { stdout, stderr } = process;
const { createReadStream } = require('fs');
const { performHead } = require('./src/headLib');

const main = function() {
  const usrArgsFrom = 2;
  const displayResult = function(result) {
    stdout.write(result.content);
    stderr.write(result.err);
  };
  performHead(process.argv.slice(usrArgsFrom), createReadStream, displayResult);
};
main();
