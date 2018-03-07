/**
 * hsBot: Supply template and your bot is ready.
 * 
 * Hardik Shah <hrdk.108@gmail.com>
 * 
 * MIT License
 */

'use strict';

function ChatDB(topicList, topics){
  this.topicList = topicList;
  this.topics = topics;
}

ChatDB.prototype._findTopicByCommand = function(command){
  var topic;
  this.topicList.some(function(value){
    if(value.command && command && value.command.indexOf(command.toLowerCase()) > -1)
      return topic = value.topic;
    else
      return false;
  });
  return topic;
}

ChatDB.prototype.getTopicFlow = function(topicName){
  var topicFlow;
  this.topics.some(function(value){
    if(value.topic === topicName)
      return topicFlow = value.flow;
    else
      return false;
  });
  return topicFlow;
}

ChatDB.prototype.getTemplateObj = function(userName, topicFlow, pattern, preQ) {
  var templateObj;
  if(pattern){
    topicFlow.some(function(obj){
      if((obj.pattern && (obj.pattern.toLowerCase() === pattern.toLowerCase() || obj.pattern === "*")) &&
          (preQ ? (obj.preQ ? preQ.indexOf(obj.preQ) > -1 : true) : true))
        return templateObj = obj;
      else
        return false;
    });
  } else if(userName) {
    topicFlow.some(function(obj){
      if(obj.redirect === true)
        return templateObj = obj;
      else
        return false;
    });
  } else {
    topicFlow.some(function(obj){
      if(obj.default === true)
        return templateObj = obj;
      else
        return false;
    });
  }
  return templateObj;
}

ChatDB.prototype._findDefaultTopic = function(){
  var topic;
  this.topicList.some(function(value){
    if(value.default === true)
      return topic = value.topic;
    else
      return false;
  });
  return topic;
}

ChatDB.prototype.getDefaultMessage = function(){
  var defaultMessage;
  this.topicList.some(function(value){
    if(value.hasOwnProperty("default_message"))
      return defaultMessage = value.default_message;
    else
      return false;
  });
  return defaultMessage;
}

module.exports = ChatDB;