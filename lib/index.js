/**
 * hsBot.js Supply template and your bot is ready.
 * 
 * Hardik Shah <hrdk.108@gmail.com>
 * 
 */

'use strict';

var ChatDB = require('../db/chatdb');
var userDB = new (require('../db/userdb'))();
var common = require('../util/common');
var HS = new (require('./hs'))();

function HSBot(topicList, topics) {
  this.chatDB = new ChatDB(topicList, topics);
}

HSBot.prototype.transformAndReply = function(userId, pattern, cb) {
  var self = this;
  pattern = common.string2literal(pattern);
  if(!userId){
    cb("UserId is not defined.");
  } else {
    var user = userDB._findUser(userId);
    if(!user){
      var response = self.welcomeUser(userId, pattern);
      cb(null, response);
    } else {
      var response = self.transform(userId, pattern, user);
      cb(null, response);
    }
  }
}

HSBot.prototype.welcomeUser = function(userId, pattern) {
  var template = this.createUser(userId);
  return this._postTransform(template, pattern);
}

HSBot.prototype.createUser = function(userId){
  var topicName  = this.chatDB._findDefaultTopic();
  var topicFlow  = this.chatDB.getTopicFlow(topicName);
  var templateObj  = this.chatDB.getTemplateObj(topicFlow);

  userDB._insertUser(userId, null, templateObj.pattern, templateObj.template, topicName);
  return templateObj.template;
}

HSBot.prototype.transform = function(userId, pattern, user) {
  var self = this;
  var topicName = pattern ? self.chatDB._findTopicByCommand(pattern) : self.chatDB._findRedirectedTopic();
  var topicFlow = self.chatDB.getTopicFlow(topicName || user.activities.topic);
  var templateObj = self.chatDB.getTemplateObj(topicFlow, pattern, user.activities.preQ);

  if(templateObj)
    userDB._updateUser(userId, user.userName || pattern, templateObj.pattern, templateObj.template, topicName || user.activities.topic);
  else
    templateObj = { template: self.chatDB.getDefaultMessage() };
  return this._postTransform(templateObj.template, pattern, user.userName || pattern);
}

HSBot.prototype._postTransform = function(s, query, uName) {
  if(s)
    s = s.replace(/[*]/g, query).replace("<userName>", uName);
  return s;
}

module.exports = HSBot;
module.exports.version = require('../package.json').version;