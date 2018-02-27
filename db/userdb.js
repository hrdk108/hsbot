/**
 * hsBot: Supply template and your bot is ready.
 * 
 * Hardik Shah <hrdk.108@gmail.com>
 * 
 * MIT License
 */

'use strict';

function UserDB(){
  this.mem = [];
}

UserDB.prototype._findUser = function(userId){
  let user;
  this.mem.some(function(userObj){
    if(userObj.userId === userId)
      return user = userObj;
  });
  return user;
}

UserDB.prototype._insertUser = function(userId, userName, pattern, preQ, topicName){
  let infoDict = {
    userName: userName,
    userId: userId,
    activities: {
      pattern: pattern,
      preQ: preQ,
      timestamp: new Date().getTime(),
      topic: topicName
    }
  };
  this.mem.push(infoDict);
  return this.mem;
}

UserDB.prototype._updateUser = function(userId, userName, pattern, preQ, topicName){
  this.mem.some(function(userObj){
    if(userObj.userId === userId){
      userObj.activities.preQ = preQ;
      userObj.activities.pattern = pattern;
      userObj.activities.topic = topicName,
      userObj.activities.timestamp = new Date().getTime(),
      userObj.userName = userObj.userName ? userObj.userName : userName;
      return true;
    }
  });
  return;
}

module.exports = UserDB;