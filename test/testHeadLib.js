const fs = require("fs");
const assert = require("chai").assert;
const {
  formatHeadLine,
  getHeadLines,
  readFile,
  extractFileName
} = require("../src/headLib");

describe("head", function() {
  describe("formatHeadLine", function() {
    it("should format the given lines", function() {
      const headLines = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
      const actual = formatHeadLine(headLines);
      const expected = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10";
      assert.strictEqual(actual, expected);
    });
  });
  describe("getHeadLines", function() {
    it("should get the head lines from the file,when the file has more than 10Lines", function() {
      const fileContent = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13";
      const actual = getHeadLines(fileContent);
      const expected = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10".split("\n");
      assert.deepStrictEqual(actual, expected);
    });
    it("should get the head lines from the file,when the file has less than 10Lines", function() {
      const fileContent = "1\n2\n3\n4\n5\n6";
      const actual = getHeadLines(fileContent);
      const expected = "1\n2\n3\n4\n5\n6".split("\n");
      assert.deepStrictEqual(actual, expected);
    });
  });
  describe("readFile", function() {
    it("should load the content of the given file", function() {
      const reader = function(path) {
        assert.strictEqual(path, "a.txt");
        return "successfully read";
      };
      const fileExists = function(fileName) {
        assert.strictEqual(fileName, "a.txt");
        return true;
      };
      const actual = readFile("a.txt", reader, fileExists);
      assert.strictEqual(actual, "successfully read");
    });
    it("should throw an error, when the given does not exist file", function() {
      const reader = function(path) {
        assert.strictEqual(path, "a.txt");
        return "successfully read";
      };
      const fileExists = function(fileName) {
        assert.strictEqual(fileName, "a.txt");
        return false;
      };
      assert.throws(() => readFile("a.txt", reader, fileExists), Error);
    });
  });
  describe("extractFileName", function() {
    it("should extract fileName from the command Line args", function() {
      const usrArgs = ["node", "head.js", "a.txt"];
      const actual = extractFileName(usrArgs);
      assert.deepStrictEqual(actual, { fileName: ["a.txt"] });
    });
  });
});
