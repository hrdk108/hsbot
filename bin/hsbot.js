/**
 * hsBot.js Supply template and your bot is ready.
 * 
 * Hardik Shah <hrdk.108@gmail.com>
 * 
 */
var readline = require('readline');
var topicList = require('../db/data/topicList.json');
var topics = require('../db/data/topics.json');
var hsBot = new (require("../lib/index.js"))(topicList, topics);
var bot = 'HSBot: ';
var you = 'You: ';
var exit = 'exit';

var rl = readline.createInterface(process.stdin, process.stdout)

rl.on('line', function(line) {
  if (line && line.trim() === 'exit') return rl.emit('close');
  hsBot.transformAndReply("aQ11zyTr4u7I", line, function(err, data){
    console.log(bot + data);
    rl.setPrompt(you);
    rl.prompt();
  });
});

rl.on('close', function() {
  console.log('\n' + bot +'Nice chat. Have a great day!');
  process.exit(0);
});

rl.emit('line');
