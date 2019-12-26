const fs = require("fs");
const { performHead } = require("./src/headLib");
const main = function() {
  const head = performHead(process.argv.slice(2), fs);
  process.stdout.write(head.content);
  process.stderr.write(head.err);
};
main();
