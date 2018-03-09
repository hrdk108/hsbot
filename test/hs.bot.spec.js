/**
 * hsBot: Supply template and your bot is ready.
 * 
 * Hardik Shah <hrdk.108@gmail.com>
 * 
 * MIT License
 */

var should = require('chai').should();
var Bot = require('../lib/index');
var ChatDB = require('../db/chatdb');
var dummyData = require('./dummy.data.json');
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
      bot.topicList.should.eql(topicList);
      bot.topics.should.eql(topics);
    });
  });

  describe('.transformAndReply()', function() {

    it('Should answer even if userId is undefined', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply(null, null, null, function(err, response){
        err.should.eql("UserId is not defined.");
        should.not.exist(response);
      });
    });

    it('Initiate by welcoming user by asking name', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4u7K", null, null, function(err, response){
        response.should.eql("What is your name?");
      });
    });

    it('Should remember your name.', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4u7K", null, "Hardik Shah", function(err, response){
        response.should.eql("Hello Hardik Shah, I am HSBOT and I will help you.");
      });
    });

    it('Should not register user again by same userId.', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4u7K", null, null, function(err, response){
        response.should.eql("Hello Hardik Shah, I am HSBOT and I will help you.");
      });
    });

    it('Should trigger @hs command properly.', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4u7K", null, "@hs", function(err, response){
        response.should.eql("1. Product List \n 2. Product on the way \n 3. Branch List \n 4. Customer care \n 5. Store detail");
      });
    });

    it('Should return default message if any string not match.', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4u7K", null, "XYZ", function(err, response){
        response.should.eql("Thank you for contacting us. you can call me by typing @hs anytime for further help.");
      });
    });

    it('Should register user directly and remember name.', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4e32", "Kartik Shah", null, function(err, response){
        response.should.eql("Hello Kartik Shah, I am HSBOT and I will help you.");
      });
    });

    it('Should continue flow by replying to bot.', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4e32", "Kartik Shah", "ok", function(err, response){
        response.should.eql("In order to support you better, I will take small survey.");
      });
    });

    it('Should return valid answer on direct command (@HS customer care).', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4u7K", null, "@HS customer care", function(err, response){
        response.should.eql("Help line number is 00 000 0000 0000");
      });
    });

    it('Should return valid answer on direct command (@HS address).', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4u7K", null, "@HS address", function(err, response){
        response.should.eql("23-D XXXX, Near XXXX, Opposite XXX, Pincode : XXXXXX");
      });
    });

    it('Should take a next topic on specific command.', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4u7K", null, "call2", function(err, response){
        response.should.eql("Hello Hardik Shah, I am HSBOT and I will help you.");
      });
    });

    describe('Negative test cases', function() {
      it('Should return undefined if default message not found.', function() {
        var topicList = dummyData.witout_defaultMessage_topicList;
        var topics = dummyData.empty_arr;
        var chatDB = new ChatDB(topicList, topics);
        var response = chatDB.getDefaultMessage();
        should.not.exist(response);
      });

      it('Should return undefined if default topic not found.', function() {
        var topicList = dummyData.witout_defaultMessage_topicList;
        var topics = dummyData.empty_arr;
        var chatDB = new ChatDB(topicList, topics);
        var response = chatDB._findDefaultTopic();
        should.not.exist(response);
      });

      it('Should return undefined if default topic not found.', function() {
        var topicList = dummyData.witout_defaultMessage_topicList;
        var topics = dummyData.topics;
        var chatDB = new ChatDB(topicList, topics);
        var response = chatDB.getTopicFlow("XYZ");
        should.not.exist(response);
      });
      
      it('Should return undefined if redirect topic not found.', function() {
        var topicList = dummyData.witout_defaultMessage_topicList;
        var topics = dummyData.topics;
        var chatDB = new ChatDB(topicList, topics);
        var response = chatDB.getTemplateObj("Hardik Shah", topics, null, null);
        should.not.exist(response);
      });
      
      it('Should return undefined if defaul topic not found.', function() {
        var topicList = dummyData.witout_defaultMessage_topicList;
        var topics = dummyData.topics;
        var chatDB = new ChatDB(topicList, topics);
        var response = chatDB.getTemplateObj(null, topics, null, null);
        should.not.exist(response);
      });
      
      it('Should return undefined if pattern not found from topics.', function() {
        var topicList = dummyData.witout_defaultMessage_topicList;
        var topics = dummyData.topics;
        var chatDB = new ChatDB(topicList, topics);
        var response = chatDB.getTemplateObj(null, topics, "XYZ", null);
        should.not.exist(response);
      });
      
      it('Should return undefined if pattern and preQ not found from topics.', function() {
        var topicList = dummyData.witout_defaultMessage_topicList;
        var topics = dummyData.topics;
        var chatDB = new ChatDB(topicList, topics);
        var response = chatDB.getTemplateObj(null, topics, "XYZ", "XYZ");
        should.not.exist(response);
      });
      
    });

  });
});