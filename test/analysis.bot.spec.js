/**
 * hsBot: Supply template and your bot is ready.
 * 
 * Hardik Shah <hrdk.108@gmail.com>
 * 
 * MIT License
 */

var should = require('chai').should();
var expect = require('chai').expect;
var Bot = require('../lib/index');
var Analysis = require('../analysis');
var dummyData = require('./dummy.data.json');
var topicList = require('../db/data/topicList.json');
var topics = require('../db/data/topics.json');

describe('Analysis', function() {

  describe('getUserAnalysis()', function() {
    it('Initiate by welcoming user by asking name', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4u7I", null, null, function(err, response){
        response.should.eql("What is your name?");
      });
    });

    it('Should remember your name.', function() {
      var bot = new Bot(topicList, topics);
      bot.transformAndReply("aQ11zyTr4u7I", null, "Hardik Shah", function(err, response){
        response.should.eql("Hello Hardik Shah, I am HSBOT and I will help you.");
      });
    });

    it('Should Analyze data.', function() {
      var bot = new Bot(topicList, topics);
      var userAnalysis = bot.getUserAnalysis("aQ11zyTr4u7I");
      expect(userAnalysis).to.have.all.keys('timeSpent', 'frequentBotText', 'frequentUserText');
    });
  });

  describe('getChatHistory()', function() {
    it('Should return user details.', function() {
      var bot = new Bot(topicList, topics);
      var user = bot.getChatHistory("aQ11zyTr4u7I");
      expect(user).to.have.all.keys('userId', 'userName', 'activities', 'loggedIn');
      expect(user.activities).to.have.length(2);
    });
  });
  
  describe('getAllUserChatHistory()', function() {
    it('Should return all user details.', function() {
      var bot = new Bot(topicList, topics);
      var user = bot.getAllUserChatHistory();
      expect(user).to.have.length(1);
      expect(user[0]).to.have.all.keys('userId', 'userName', 'activities', 'loggedIn');
    });
  });

  describe('analysis._analyzed()', function() {
    it('Should return all user details.', function() {
      var userData = dummyData.userData;
      var analysis = new Analysis();
      var userAnalysis = analysis._analyzed(userData);
      expect(userAnalysis).to.have.all.keys('timeSpent', 'frequentBotText', 'frequentUserText');
    });
  });

});