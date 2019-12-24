const fs = require("./src/config");
const { performHead } = require("./src/headLib");
const main = function() {
  const head = performHead(process.argv.slice(2), fs);
  head.err && process.stderr.write(head.content);
  head.err || process.stdout.write(head.content);
};
main();
