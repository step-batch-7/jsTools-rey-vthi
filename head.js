const fs = require("./src/config");
const {
  extractFileName,
  readFile,
  getHeadLines,
  formatHeadLine
} = require("./src/headLib");
const main = function() {
  const parsedArgs = extractFileName(process.argv);
  const fileContents = readFile(parsedArgs.fileName[0], fs);
  const headLines = getHeadLines(fileContents);
  console.log(formatHeadLine(headLines));
};
main();
