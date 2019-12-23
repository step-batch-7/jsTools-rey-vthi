const fs = require("./src/config");
const { performHead } = require("./src/headLib");
const main = function() {
  const head = performHead(process.argv.slice(2), fs);
  head.err && console.error(head.content);
  head.err || console.log(head.content);
};
main();
