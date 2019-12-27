const assert = require("chai").assert;
const {
  performHead,
  getHeadLines,
  readFile,
  parseArgs
} = require("../src/headLib");

describe("head", function() {
  describe("getHeadLines", function() {
    it("should get the head lines from the file,when the file has more than 10Lines", function() {
      const fileContent = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13";
      const actual = getHeadLines(fileContent, 10);
      const expected = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10";
      assert.deepStrictEqual(actual, expected);
    });
    it("should get the head lines from the file,when the file has less than 10Lines", function() {
      const fileContent = "1\n2\n3\n4\n5\n6";
      const actual = getHeadLines(fileContent, 6);
      const expected = "1\n2\n3\n4\n5\n6";
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
      fs = { readFileSync: reader, existsSync: fileExists };
      const actual = readFile("a.txt", fs);
      assert.deepStrictEqual(actual, {
        content: "successfully read",
        err: ""
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
      fs = { readFileSync: reader, existsSync: fileExists };
      const expected = {
        err: "head : a.txt No such file or directory",
        content: ""
      };
      assert.deepStrictEqual(readFile("a.txt", fs), expected);
    });
  });
  describe("performHead", function() {
    it("should perform head for the given file", function() {
      const reader = function(path) {
        assert.strictEqual(path, "existingFile.txt");
        return "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13";
      };
      const fileExists = function(fileName) {
        assert.strictEqual(fileName, "existingFile.txt");
        return true;
      };
      fs = { readFileSync: reader, existsSync: fileExists };
      const actual = performHead(["existingFile.txt"], fs);
      const expected = { content: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10", err: "" };
      assert.deepStrictEqual(actual, expected);
    });
    it("should give the error, when the file doesn't exist", function() {
      const reader = function(path) {
        assert.strictEqual(path, "existingFile.txt");
        return `head: ${path}No such file or directory`;
      };
      const fileExists = function(fileName) {
        assert.strictEqual(fileName, "existingFile.txt");
        return false;
      };
      fs = { readFileSync: reader, existsSync: fileExists };
      const actual = performHead(["existingFile.txt"], fs);
      const expected = {
        err: `head : existingFile.txt No such file or directory`,
        content: ""
      };
      assert.deepStrictEqual(actual, expected);
    });
    it("should give the error, when the userCount is invalid", function() {
      fs = {};
      const actual = performHead(["-n", "f", "existingFile.txt"], fs);
      const expected = {
        err: `head: illegal line count -- f`,
        content: ""
      };
      assert.deepStrictEqual(actual, expected);
    });
  });
  describe("parseArgs", function() {
    it("should update the status of the given user Option", function() {
      const usrArgs = ["-n", "7", "existingFile.txt"];
      const actual = parseArgs(usrArgs);
      const expected = {
        files: "existingFile.txt",
        count: 7
      };
      assert.deepStrictEqual(actual, expected);
    });
    it("should give the default count,when the user has not count", function() {
      const usrArgs = ["existingFile.txt"];
      const actual = parseArgs(usrArgs);
      const expected = {
        files: "existingFile.txt",
        count: 10
      };
      assert.deepStrictEqual(actual, expected);
    });
    it("should give the default count,when the user has not count", function() {
      const usrArgs = ["existingFile.txt"];
      const actual = parseArgs(usrArgs);
      const expected = {
        files: "existingFile.txt",
        count: 10
      };
      assert.deepStrictEqual(actual, expected);
    });
    it("should throw error, when user option in", function() {
      const usrArgs = ["-n", "d", "existingFile.txt"];
      const actual = parseArgs(usrArgs);
      const expected = {
        files: "existingFile.txt",
        count: 10,
        err: `head: illegal line count -- d`
      };
      assert.deepStrictEqual(actual, expected);
    });
  });
});
