const assert = require('chai').assert;
const sinon = require('sinon');
const performHead = require('../src/headLib');

describe('head', function() {
  describe('performHead', function() {
    it('should getHeadLines, where the file has > 10lines', function(done) {
      const onComplete = function(result) {
        assert.strictEqual(result.content, '1\n2\n3\n4\n5\n6\n7\n8\n9\n10');
        assert.strictEqual(result.err, '');
        done();
      };
      const readStream = { setEncoding: sinon.fake(), on: sinon.fake() };
      const createReadStream = sinon.fake.returns(readStream);
      performHead(['a.txt'], createReadStream, '', onComplete);
      assert(readStream.setEncoding.calledWith('utf8'));
      assert.strictEqual(readStream.on.firstCall.args[0], 'data');
      assert.strictEqual(readStream.on.secondCall.args[0], 'error');
      assert.strictEqual(readStream.on.callCount, 2);
      readStream.on.firstCall.args[1]('1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11');
      readStream.on.secondCall.args[1]();
    });

    it('should getHeadLines, where the file has < 10lines', function(done) {
      const onComplete = function(result) {
        assert.strictEqual(result.content, '1\n2\n3\n4\n5\n6\n7');
        assert.strictEqual(result.err, '');
        done();
      };
      const readStream = { setEncoding: sinon.fake(), on: sinon.fake() };
      const createReadStream = sinon.fake.returns(readStream);
      performHead(['a.txt'], createReadStream, '', onComplete);
      assert(readStream.setEncoding.calledWith('utf8'));
      assert.strictEqual(readStream.on.firstCall.args[0], 'data');
      assert.strictEqual(readStream.on.secondCall.args[0], 'error');
      assert.strictEqual(readStream.on.callCount, 2);
      readStream.on.firstCall.args[1]('1\n2\n3\n4\n5\n6\n7');
      readStream.on.secondCall.args[1]();
    });
    it('should getHeadLines of the file for the given count', function(done) {
      const usrArgs = ['-n', '3', 'a.txt'];
      const onComplete = function(result) {
        assert.strictEqual(result.content, '1\n2\n3');
        assert.strictEqual(result.err, '');
        done();
      };
      const readStream = { setEncoding: sinon.fake(), on: sinon.fake() };
      const createReadStream = sinon.fake.returns(readStream);
      performHead(usrArgs, createReadStream, '', onComplete);
      assert(readStream.setEncoding.calledWith('utf8'));
      assert.strictEqual(readStream.on.firstCall.args[0], 'data');
      assert.strictEqual(readStream.on.secondCall.args[0], 'error');
      assert.strictEqual(readStream.on.callCount, 2);
      readStream.on.firstCall.args[1]('1\n2\n3\n4\n5\n6\n7');
      readStream.on.secondCall.args[1]();
    });
    it('should give error when the given file does not exist', function(done) {
      const usrArgs = ['badFile.txt'];
      const onComplete = function(result) {
        assert.strictEqual(result.content, '');
        assert.strictEqual(result.err, 'head: No such file or directory');
        done();
      };
      const readStream = { setEncoding: sinon.fake(), on: sinon.fake() };
      const createReadStream = sinon.fake.returns(readStream);
      performHead(usrArgs, createReadStream, '', onComplete);
      assert(readStream.setEncoding.calledWith('utf8'));
      assert.strictEqual(readStream.on.firstCall.args[0], 'data');
      assert.strictEqual(readStream.on.secondCall.args[0], 'error');
      assert.ok(readStream.on.callCount, 2);
      readStream.on.secondCall.args[1]({ code: 'ENOENT' });
    });
    it('should give the error, when the given count is invalid', function() {
      const usrArgs = ['-n', 'r', 'a.txt'];
      const onComplete = sinon.stub();
      performHead(usrArgs, '', '', onComplete);
      const result = { err: 'head: illegal line count -- r', content: '' };
      assert.ok(onComplete.calledOnceWithExactly(result));
    });
    it('should getHeadLines from stdIn,where it has > 10lines', function(done) {
      const stdin = { setEncoding: sinon.fake(), on: sinon.fake() };
      const onComplete = function(result) {
        assert.strictEqual(result.content, '1\n2\n3\n4\n5\n6\n7\n8\n9\n10');
        assert.strictEqual(result.err, '');
        done();
      };
      performHead([], '', stdin, onComplete);
      assert(stdin.setEncoding.calledWith('utf8'));
      assert.strictEqual(stdin.on.firstCall.args[0], 'data');
      assert.strictEqual(stdin.on.secondCall.args[0], 'error');
      assert.strictEqual(stdin.on.callCount, 2);
      stdin.on.firstCall.args[1]('1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11');
      stdin.on.secondCall.args[1]();
    });
    it('should getHeadLines from stdIn,where it has < 10lines', function(done) {
      const stdin = { setEncoding: sinon.fake(), on: sinon.fake() };
      const onComplete = function(result) {
        assert.strictEqual(result.content, '1\n2\n3\n4\n5\n6');
        assert.strictEqual(result.err, '');
        done();
      };
      performHead([], '', stdin, onComplete);
      assert(stdin.setEncoding.calledWith('utf8'));
      assert.strictEqual(stdin.on.firstCall.args[0], 'data');
      assert.strictEqual(stdin.on.secondCall.args[0], 'error');
      assert.strictEqual(stdin.on.callCount, 2);
      stdin.on.firstCall.args[1]('1\n2\n3\n4\n5\n6');
      stdin.on.secondCall.args[1]();
    });
  });
});
