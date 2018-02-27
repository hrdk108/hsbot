/**
 * hsBot.js Supply template and your bot is ready.
 * 
 * Hardik Shah <hrdk.108@gmail.com>
 * 
 */

var should = require('chai').should();
var expect = require('chai').expect;
var UserDB = require('../db/userdb');

describe('UserDB', function() {

  describe('constructor', function() {
    it('Array should be blank: ', function() {
      var userDb = new UserDB();
      expect(userDb.mem).to.have.length(0);
    });
  });

  describe('._insertUser()', function() {
    it('Should insert user.', function() {
      var userDb = new UserDB();
      userDb._insertUser("aQ11zyTr4u7I", "Hardik Shah", "Hardik Shah", "What is your name?", "call1")
      expect(userDb.mem).to.have.length(1);
    });
  });

  describe('._updateUser()', function() {
    it('Should update user.', function() {
      var userDb = new UserDB();
      userDb._insertUser("aQ11zyTr4u7I", "Hardik Shah", "Hardik Shah", "What is your name?", "call1")
      userDb._updateUser("aQ11zyTr4u7I", "Hardik Shah", "@hs", "What is your name?", "command");
      var user = userDb._findUser("aQ11zyTr4u7I");
      user.activities.pattern.should.eql("@hs");
      user.activities.topic.should.eql("command");
      user.userId.should.eql("aQ11zyTr4u7I");
      expect(userDb.mem).to.have.length(1);
      
    });
  });

  describe('._findUser()', function() {
    it('Should find user.', function() {
      var userDb = new UserDB();
      userDb._insertUser("aQ11zyTr4u7I", "Hardik Shah", "Hardik Shah", "What is your name?", "call1")
      var user = userDb._findUser("aQ11zyTr4u7I");
      user.userId.should.eql("aQ11zyTr4u7I");
      expect(userDb.mem).to.have.length(1);
    });
  });
});