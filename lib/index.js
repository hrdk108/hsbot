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
  var self = this;
  pattern = common.string2literal(pattern);
  if(!userId){
    cb("UserId is not defined.");
  } else {
    var user = userDB._findUser(userId);
    if(!user){
      var response = self.welcomeUser(userId, userName);
      cb(null, response);
    } else {
      var response = self.transform(userId, pattern, user);
      cb(null, response);
    }
  }
}

HSBot.prototype.welcomeUser = function(userId, userName) {
  var template = this.createUser(userId, userName);
  var postStringDict = {
    template: template,
    userName: userName
  }
  return this._postTransform(postStringDict);
}

HSBot.prototype.createUser = function(userId, userName){
  var chatDB = new ChatDB(this.topicList, this.topics);
  var topicName = chatDB._findDefaultTopic();
  var topicFlow  = chatDB.getTopicFlow(topicName);
  var templateObj  = chatDB.getTemplateObj(userName, topicFlow);

  userDB._insertUser(userId, userName, templateObj.pattern, templateObj.template, topicName);
  return templateObj.template;
}

HSBot.prototype.transform = function(userId, pattern, user) {
  var self = this;
  var chatDB = new ChatDB(this.topicList, this.topics);
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
  }

  return this._postTransform(postStringDict);
}

HSBot.prototype._postTransform = function(postStringDict) {
  var s = postStringDict.template;
  var query = postStringDict.query;
  var uName = postStringDict.userName;
  if(s)
    s = s.replace(/[*]/g, query).replace("<userName>", uName);
  return s;
}

HSBot.prototype.getUserAnalysis = function(userId) {
  var user = userDB._findUser(userId);
  var analysisData = analysis._analyzed(user);
  return analysisData
}

HSBot.prototype.getChatHistory = function(userId) {
  var user = userDB._findUser(userId);
  return user;
}

HSBot.prototype.getAllUserChatHistory = function(userId) {
  var userList = userDB.mem;
  return userList;
}

module.exports = HSBot;
module.exports.version = require('../package.json').version;