/**
 * hsBot: Supply template and your bot is ready.
 * 
 * Hardik Shah <hrdk.108@gmail.com>
 * 
 * MIT License
 */

'use strict';

var ChatDB = require('../db/chatdb');
var analysis = new(require('../analysis'))();
var userDB = new (require('../db/userdb'))();
var common = require('../util/common');

function HSBot(topicList, topics) {
  this.topicList = topicList;
  this.topics = topics;
}

HSBot.prototype.transformAndReply = function(userId, userName, pattern, cb) {
  var topicList = this.topicList;
  var topics = this.topics;
  var chatDB = new ChatDB(topicList, topics);
  pattern = common.string2literal(pattern);

  if(!userId){
    cb("UserId is not defined.");
  } else {
    var user = userDB._findUser(userId);
    if(!user){
      var response = welcomeUser();
      cb(null, response);
    } else {
      var response = transform(userId, pattern, user);
      cb(null, response);
    }
  }
  

  function welcomeUser() {
    var template = createUser();
    var postStringDict = {
      template: template,
      userName: userName
    };
    return _postTransform(postStringDict);
  }
  
  function createUser(){
    var topicName = chatDB._findDefaultTopic();
    var topicFlow  = chatDB.getTopicFlow(topicName);
    var templateObj  = chatDB.getTemplateObj(userName, topicFlow);
  
    userDB._insertUser(userId, userName, templateObj.pattern, templateObj.template, topicName);
    return templateObj.template;
  }
  
  function transform() {
    var lastIndex = user.activities.length -1;
    var preQ = user.activities[lastIndex].preQ;

    var topicName = pattern? (chatDB._findTopicByCommand(pattern) || user.activities[lastIndex].topic) : chatDB._findDefaultTopic();
    var topicFlow = chatDB.getTopicFlow(topicName);
    var templateObj = chatDB.getTemplateObj(user.userName, topicFlow, pattern, preQ);
  
    if(templateObj)
      userDB._updateUser(userId, user.userName || pattern, templateObj.pattern, templateObj.template, topicName);
    else
      templateObj = { template: chatDB.getDefaultMessage() };

    var postStringDict = {
      template: templateObj.template,
      query: pattern,
      userName: user.userName || pattern
    };

    return _postTransform(postStringDict);
  }

  function _postTransform(resObj) {
    var s = resObj.template;
    s = s.replace(/[*]/g, resObj.query).replace("<userName>", resObj.userName);
    return s;
  }
};

HSBot.prototype.getUserAnalysis = function(userId) {
  var user = userDB._findUser(userId);
  var analysisData = analysis._analyzed(user);
  return analysisData;
};

HSBot.prototype.getChatHistory = function(userId) {
  var user = userDB._findUser(userId);
  return user;
};

HSBot.prototype.getAllUserChatHistory = function() {
  var userList = userDB.mem;
  return userList;
};

module.exports = HSBot;
module.exports.version = require('../package.json').version;