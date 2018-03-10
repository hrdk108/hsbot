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

/**
 * A collection of `HSBOT` functions for talk with bot and analyze data.
 * Supply template and your bot is ready.
 * @name HSBOT
 * @constructor
 * @param {Array} topicList - A collection of JSON object.
 * @param {Array} topics - A collection of JSON object.
 * @example
 * 
 * var topicList = require('../db/data/topicList.json'); // Your file path as per defined template.
 * var topics = require('../db/data/topics.json'); // Your file path as per defined template.
 * const HSBot = require('hsbot');
 * const hsBot = new HSBot(topicList, topics);
 */
function HSBot(topicList, topics) {
  this.topicList = topicList;
  this.topics = topics;
}

/**
 * This method is responsible to reply.
 * @name transformAndReply
 * @method
 * @param {String} userId - User's ID.
 * @param {String} userName - User name.
 * @param {String} pattern - A human text or user query.
 * @return {callback} error-first callback, bot result based on user query.
 * @example
 * var topicList = require('../db/data/topicList.json'); // Your file path as per defined template.
 * var topics = require('../db/data/topics.json'); // Your file path as per defined template.
 * const HSBot = require('hsbot');
 * const hsBot = new HSBot(topicList, topics);
 * var userId = "aQ11zyTr4u7I";
 * var userName;
 *
 * hsBot.transformAndReply(userId, userName, human_text, function(err, data){
 *   console.log("HSBot:", data);
 * });
 */

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

/**
 * This method will generate user analysis based on him activities.
 * @name getUserAnalysis
 * @method
 * @param {String} userId - User's ID.
 * @returns {JSON} Analysis of aggregate of user activities
 * @example
 * var topicList = require('../db/data/topicList.json'); // Your file path as per defined template.
 * var topics = require('../db/data/topics.json'); // Your file path as per defined template.
 * const HSBot = require('hsbot');
 * const hsBot = new HSBot(topicList, topics);
 * var userId = "aQ11zyTr4u7I";
 *
 * hsBot.getUserAnalysis(userId);
 * 
 * @example
 * {
 *  "timeSpent": "100261",
 *  "frequentBotText": "Thank you for contacting us. you can call me by typing @hs anytime for further help.",
 *  "frequentUserText": "@hs"
 * }
 */
HSBot.prototype.getUserAnalysis = function(userId) {
  var user = userDB._findUser(userId);
  var analysisData = analysis._analyzed(user);
  return analysisData;
};

/**
 * This method is responsible to get user details based on userId.
 * @name getChatHistory
 * @method
 * @param {String} userId - User's ID.
 * @example
 * var topicList = require('../db/data/topicList.json'); // Your file path as per defined template.
 * var topics = require('../db/data/topics.json'); // Your file path as per defined template.
 * const HSBot = require('hsbot');
 * const hsBot = new HSBot(topicList, topics);
 * var userId = "aQ11zyTr4u7I";
 *
 * hsBot.getChatHistory(userId);
 * 
 * @returns {JSON} user object.
 * @example
 * {
 *   userName: "Hardik Shah",
 *   userId: "aQ11zyTr4u7I",
 *   loggedIn: 1235637,
 *   activities: [
 *    {
 *      pattern: null,
 *      preQ: "What is your name?",
 *      ut: 12345688,
 *      topic: "call1"
 *    },
 *    {
 *     pattern: "Hardik Shah",
 *     preQ: "Welcome Hardik Shah, How can I assist you?",
 *     ut: 12345999,
 *     topic: "call1"
 *   }
 *  ]
 * }
 */
HSBot.prototype.getChatHistory = function(userId) {
  var user = userDB._findUser(userId);
  return user;
};

/**
 * This method is responsible to get all user details.
 * @name getAllUserChatHistory
 * @method
 * @example
 * var topicList = require('../db/data/topicList.json'); // Your file path as per defined template.
 * var topics = require('../db/data/topics.json'); // Your file path as per defined template.
 * const HSBot = require('hsbot');
 * const hsBot = new HSBot(topicList, topics);
 * var userId = "aQ11zyTr4u7I";
 *
 * hsBot.getChatHistory(userId);
 * 
 * @returns {Array} Array of all user details.
 * 
 * @example
 * [
 *   {
 *     userName: "Hardik Shah",
 *     userId: "aQ11zyTr4u7I",
 *     loggedIn: 1235637,
 *     activities: [
 *      {
 *        pattern: null,
 *        preQ: "What is your name?",
 *        ut: 12345688,
 *        topic: "call1"
 *      },
 *      {
 *        pattern: "Hardik Shah",
 *        preQ: "Welcome Hardik Shah, How can I assist you?",
 *        ut: 12345999,
 *        topic: "call1"
 *      }
 *     ]
 *   },
 *   {
 *     userName: "Kartik Shah",
 *     userId: "aQ11zyTr4u22",
 *     loggedIn: 1235637,
 *     activities: [
 *      {
 *        pattern: null,
 *        preQ: "What is your name?",
 *        ut: 12345688,
 *        topic: "call1"
 *      },
 *      {
 *        pattern: "Kartik Shah",
 *        preQ: "Welcome Kartik Shah, How can I assist you?",
 *        ut: 12345999,
 *        topic: "call1"
 *      }
 *     ]
 *   }
 * ]
 */
HSBot.prototype.getAllUserChatHistory = function() {
  var userList = userDB.mem;
  return userList;
};

module.exports = HSBot;
module.exports.version = require('../package.json').version;