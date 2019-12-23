const fs = require("fs");

const fileSystem = {
  fileExists: fs.existsSync,
  readFile: fs.readFileSync,
  encoding: "utf8"
};

module.exports = fileSystem;
