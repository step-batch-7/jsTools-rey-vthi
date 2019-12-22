const formatHeadLine = function(lines) {
  return lines.join("\n");
};

const getHeadLines = function(fileContent) {
  const listOfLines = fileContent.split("\n");
  return listOfLines.slice(0, 10);
};

module.exports = { formatHeadLine, getHeadLines };
