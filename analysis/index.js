/**
 * hsBot: Supply template and your bot is ready.
 * 
 * Hardik Shah <hrdk.108@gmail.com>
 * 
 * MIT License
 */

function Analysis(){

}

Analysis.prototype._analyzed = function(userData){
  var analyzedData = {};
  var loggedInTime = userData.loggedIn;
  var lastActivity = userData.activities[userData.activities.length-1].ut;
  analyzedData.timeSpent = lastActivity - loggedInTime;
  var frequentArr = this.getFrequentText(userData.activities);
  frequentArr.forEach(function(obj){
    if(obj.type == "question"){
      analyzedData.frequentBotText = obj.text;
    }
    if(obj.type == "command"){
      analyzedData.frequentUserText = obj.text;
    }
  });
  return analyzedData;
};

Analysis.prototype.getFrequentText = function(activities){
  var countArr = {
    question : {},
    command: {}
  };
  activities.forEach(function(act){
    countArr.question[act.preQ] = (countArr.question[act.preQ]||0) + 1;
    countArr.command[act.pattern] = (countArr.command[act.pattern]||0) + 1;
  });

  var max = 0, t = "", frequentArr = [];
  for (var key in countArr) {
    for (var key1 in countArr[key]) {
      if(max <= parseInt(countArr[key][key1])){
        max = countArr[key][key1];
        t = key1;
      } else {
        max = max;
      }
    }
    frequentArr.push({"text": t, type: key});
    max = 0, t= "";
  }

  return frequentArr;
};

module.exports = Analysis;