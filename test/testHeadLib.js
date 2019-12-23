const assert = require("chai").assert;
const {
  performHead,
  formatHeadLine,
  getHeadLines,
  readFile,
  parseArgs
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
      const actual = getHeadLines(fileContent, 10);
      const expected = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10".split("\n");
      assert.deepStrictEqual(actual, expected);
    });
    it("should get the head lines from the file,when the file has less than 10Lines", function() {
      const fileContent = "1\n2\n3\n4\n5\n6";
      const actual = getHeadLines(fileContent, 6);
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
      fs = { readFile: reader, fileExists: fileExists, encoding: "utf8" };
      const actual = readFile("a.txt", fs);
      assert.deepStrictEqual(actual, {
        content: "successfully read"
      });
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
      fs = { readFile: reader, fileExists: fileExists, encoding: "utf8" };
      const expected = {
        content: "head : No such a file or directory",
        err: true
      };
      assert.deepStrictEqual(readFile("a.txt", fs), expected);
    });
  });
  describe("parseArgs", function() {
    it("should extract fileName from the command Line args", function() {
      const usrArgs = ["a.txt"];
      const actual = parseArgs(usrArgs);
      const expected = { files: "a.txt", count: 10, isValidOption: true };
      assert.deepStrictEqual(actual, expected);
    });
    it("should extract fileName and count from the command Line args", function() {
      const usrArgs = ["-n", "7", "a.txt"];
      const actual = parseArgs(usrArgs);
      const expected = { files: "a.txt", count: 7, isValidOption: true };
      assert.deepStrictEqual(actual, expected);
    });
    it("should throw error, when count is not a number", function() {
      const usrArgs = ["-n", "d", "a.txt"];
      assert.throws(() => parseArgs(usrArgs), Error);
    });
  });
  describe("performHead", function() {
    it("should get the head lines of the given file", function() {
      const usrArgs = ["a.txt"];
      const reader = function(path) {
        assert.strictEqual(path, "a.txt");
        return "successfully read";
      };
      const fileExists = function(fileName) {
        assert.strictEqual(fileName, "a.txt");
        return true;
      };
      fs = { readFile: reader, fileExists: fileExists, encoding: "utf8" };
      const actual = performHead(usrArgs, fs);
      assert.deepStrictEqual(actual, {
        content: "successfully read"
      });
    });
  });
});
