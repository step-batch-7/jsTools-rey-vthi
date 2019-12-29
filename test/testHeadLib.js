const assert = require('chai').assert;
const sinon = require('sinon');
const EventEmitter = require('events');
const { getHeadLines, parseArgs, performHead } = require('../src/headLib');

describe('head', function() {
  describe('getHeadLines', function() {
    it('should get headLines of given data,where number of lines given is > 10lines', function() {
      const fileContent = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13';
      const count = 10;
      const actual = getHeadLines(fileContent, count);
      const expected = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10';
      assert.deepStrictEqual(actual, expected);
    });
    it('should get the head lines from the file,when the file has less than 10Lines', function() {
      const fileContent = '1\n2\n3\n4\n5\n6';
      const count = 10;
      const actual = getHeadLines(fileContent, count);
      const expected = '1\n2\n3\n4\n5\n6';
      assert.deepStrictEqual(actual, expected);
    });
  });
  describe('parseArgs', function() {
    it('should give the default count,when the user has not count', function() {
      const usrArgs = ['existingFile.txt'];
      const count = 10;
      const actual = parseArgs(usrArgs);
      const expected = { file: 'existingFile.txt', count };
      assert.deepStrictEqual(actual, expected);
    });
    it('should update the status of the given user Option', function() {
      const usrArgs = ['-n', '7', 'existingFile.txt'];
      const count = 7;
      const actual = parseArgs(usrArgs);
      const expected = { file: 'existingFile.txt', count };
      assert.deepStrictEqual(actual, expected);
    });

    it('should give the default count,when the user has not count', function() {
      const usrArgs = ['existingFile.txt'];
      const count = 10;
      const actual = parseArgs(usrArgs);
      const expected = { file: 'existingFile.txt', count };
      assert.deepStrictEqual(actual, expected);
    });
    it('should throw error, when user option in', function() {
      const usrArgs = ['-n', 'd', 'existingFile.txt'];
      const count = NaN;
      const err = `head: illegal line count -- d`;
      const actual = parseArgs(usrArgs);
      const expected = { file: 'existingFile.txt', count, err };
      assert.deepStrictEqual(actual, expected);
    });
  });
  describe('performHead', function() {
    it('should getHeadLines of the specified file,where it has more than 10lines', function() {
      const usrArgs = ['a.txt'];
      const displayResult = sinon.stub();
      const eventEmitter = new EventEmitter();
      eventEmitter.setEncoding = sinon.spy();
      const createReadStream = sinon.fake.returns(eventEmitter);
      performHead(usrArgs, { createReadStream, stdin: '' }, displayResult);
      assert.ok(createReadStream.calledOnceWithExactly('a.txt'));
      eventEmitter.emit('data', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11');
      const result = { err: '', content: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10' };
      assert.ok(displayResult.calledOnceWithExactly(result));
    });
    it('should getHeadLines of the specified file,where it has less than 10lines', function() {
      const usrArgs = ['a.txt'];
      const displayResult = sinon.stub();
      const eventEmitter = new EventEmitter();
      eventEmitter.setEncoding = sinon.spy();
      const createReadStream = sinon.fake.returns(eventEmitter);
      performHead(usrArgs, { createReadStream, stdin: '' }, displayResult);
      assert.ok(createReadStream.calledOnceWithExactly('a.txt'));
      eventEmitter.emit('data', '1\n2\n3\n4\n5\n6\n7\n8');
      const result = { err: '', content: '1\n2\n3\n4\n5\n6\n7\n8' };
      assert.ok(displayResult.calledOnceWithExactly(result));
    });
    it('should getHeadLines of the specified file for the given count', function() {
      const usrArgs = ['-n', '6', 'a.txt'];
      const displayResult = sinon.stub();
      const eventEmitter = new EventEmitter();
      eventEmitter.setEncoding = sinon.spy();
      const createReadStream = sinon.fake.returns(eventEmitter);
      performHead(usrArgs, { createReadStream, stdin: '' }, displayResult);
      assert.ok(createReadStream.calledOnceWithExactly('a.txt'));
      eventEmitter.emit('data', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10');
      const result = { err: '', content: '1\n2\n3\n4\n5\n6' };
      assert.ok(displayResult.calledOnceWithExactly(result));
    });
    it('should give error when the given file does not exist', function() {
      const usrArgs = ['-n', '6', 'a.txt'];
      const displayResult = sinon.stub();
      const eventEmitter = new EventEmitter();
      eventEmitter.setEncoding = sinon.spy();
      const createReadStream = sinon.fake.returns(eventEmitter);
      performHead(usrArgs, { createReadStream, stdin: '' }, displayResult);
      assert.ok(createReadStream.calledOnceWithExactly('a.txt'));
      const result = { err: 'head: No such file or directory', content: '' };
      eventEmitter.emit('error', { code: 'ENOENT' });
      assert.ok(displayResult.calledOnceWithExactly(result));
    });
    it('should give the error, when the given count is invalid', function() {
      const usrArgs = ['-n', 'r', 'a.txt'];
      const displayResult = sinon.stub();
      performHead(usrArgs, '', displayResult);
      const result = { err: 'head: illegal line count -- r', content: '' };
      assert.ok(displayResult.calledOnceWithExactly(result));
    });
    it('should getLines from stdIn,give the head of that data', function() {
      const displayResult = sinon.stub();
      const stdin = new EventEmitter();
      stdin.setEncoding = sinon.spy();
      performHead([], { createReadStream: '', stdin }, displayResult);
      stdin.emit('data', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11');
      const result = { err: '', content: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10' };
      assert.ok(displayResult.calledOnceWithExactly(result));
    });
  });
});
