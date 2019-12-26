const fs = require("fs");
const { performHead } = require("./src/headLib");
const main = function() {
  const { content, err } = performHead(process.argv.slice(2), fs);
  process.stdout.write(content);
  process.stderr.write(err);
};
main();
