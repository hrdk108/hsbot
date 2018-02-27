/**
 * hsBot: Supply template and your bot is ready.
 * 
 * Hardik Shah <hrdk.108@gmail.com>
 * 
 * MIT License
 */

var should = require('chai').should();
var Bot = require('../lib/index');
var topicList = require('../db/data/topicList.json');
var topics = require('../db/data/topics.json');

describe('Bot', function() {
  describe('version', function() {
    it('Should be exposed', function() {
      Bot.version.should.be.ok;
    });
  });

  describe('constructor', function() {
    it('Should load topic list and topics', function() {
      var bot = new Bot(topicList, topics);
      bot.chatDB.topicList.should.eql(topicList);
      bot.chatDB.topics.should.eql(topics);
    });
  });

  describe('.transformAndReply()', function() {

    it('Should answer even if userId is undefined', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply(null, null, function(err, response){
        err.should.eql("UserId is not defined.");
      });
    });

    it('Initiate by welcoming user by asking name', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4u7I", null, function(err, response){
        response.should.eql("What is your name?");
      });
    });

    it('Should remember your name.', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4u7I", "Hardik Shah", function(err, response){
        response.should.eql("Hello Hardik Shah, I am HSBOT and I will help you.");
      });
    });

    it('Should not register user again by same userId.', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4u7I", null, function(err, response){
        response.should.eql("Hello Hardik Shah, I am HSBOT and I will help you.");
      });
    });

    it('Should trigger @hs command properly.', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4u7I", "@hs", function(err, response){
        response.should.eql("1. Product List \n 2. Product on the way \n 3. Branch List \n 4. Customer care \n 5. Store detail");
      });
    });

  });
});