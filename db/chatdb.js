/**
 * hsBot.js Supply template and your bot is ready.
 * 
 * Hardik Shah <hrdk.108@gmail.com>
 * 
 */

'use strict';

function ChatDB(topicList, topics){
  this.topicList = topicList;
  this.topics = topics;
}

ChatDB.prototype._findTopicByCommand = function(command){
  let topic;
  this.topicList.some(function(value){
    if(value.command && command && value.command.indexOf(command.toLowerCase()) > -1)
      return topic = value.topic;
  });
  return topic;
}

ChatDB.prototype.getTopicFlow = function(topicName){
  let topicFlow;
  this.topics.some(function(value){
    if(value.topic === topicName)
      return topicFlow = value.flow;
  });
  return topicFlow;
}

ChatDB.prototype.getTemplateObj = function(topicFlow, pattern, preQ) {
  let templateObj;
  if(pattern){
    topicFlow.some(function(obj){
      if((obj.pattern.toLowerCase() === pattern.toLowerCase() || obj.pattern === "*") &&
          (preQ ? (obj.preQ ? preQ.indexOf(obj.preQ) > -1 : true) : true))
        return templateObj = obj;
    });
  } else {
    topicFlow.some(function(obj){
      if(obj.default === true)
        return templateObj = obj;
    });
  }
  return templateObj;
}

ChatDB.prototype._findDefaultTopic = function(){
  let topic;
  this.topicList.some(function(value){
    if(value.default === true)
      return topic = value.topic;
  });
  return topic;
}

ChatDB.prototype._findRedirectedTopic = function(){
  let topic;
  this.topicList.some(function(value){
    if(value.redirect === true){
      return topic = value.topic;
    }
  });
  return topic;
}

ChatDB.prototype.getDefaultMessage = function(){
  let defaultMessage;
  this.topicList.some(function(value){
    if(value.hasOwnProperty("default_message"))
      return defaultMessage = value.default_message;
  });
  return defaultMessage;
}

module.exports = ChatDB;