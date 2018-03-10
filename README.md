<h1 align="center">
  <img width="450" src="./docs/img/logo.png" alt="hsbot.js">
  <br>
</h1>

[![Build Status](https://travis-ci.org/hrdk108/hsbot.svg?style=plastic)](https://travis-ci.org/hrdk108/hsbot) [![Coverage Status](https://img.shields.io/coveralls/github/hrdk108/hsbot.svg?branch=master)](https://coveralls.io/github/hrdk108/hsbot?branch=master) [![NPM Download](https://img.shields.io/npm/dt/hsbot.svg?style=plastic)](https://www.npmjs.com/package/hsbot) [![NPM Version](https://img.shields.io/npm/v/hsbot.svg?style=plastic)](https://www.npmjs.com/package/hsbot) [![Known Vulnerabilities](https://snyk.io/test/github/hrdk108/hsbot/badge.svg?style=plastic)](https://snyk.io/test/github/hrdk108/hsbot) [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=plastic)](https://github.com/hrdk108/hsbot/blob/master/LICENSE)

## Quick demo using terminal
![DEMO](./docs/img/hsbot_terminal_demo.gif)

## Quick demo: How to integrate into project
![DEMO](./docs/img/hsbot_project_demo.gif)

## Description

Pass your custom template and you are ready to use your own bot.
For detailed document see this [HSBOT document](https://hrdk108.github.io/hsbot/)

## Features

- Pass custom template. Template should be in format as defined.
- You can integrate with your system easily.
- Analyze user chat history.

## Install

```
$ npm install hsbot -g
"or"
$ npm i install hsbot
```
## Usage
```
Usage: hsbot
```
Now you are ready to use hsbot.

## Points to keep in mind

* __userId__: UserId is mandatory.
* __userName__: *(optional)* If pass it will not ask you about your name. If not, hsbot will ask you about your name first.
* __topicList__ and __topics__: These two files you need to pass to the constructor of hsbot. You can find template under __hsbot -> db -> data__
* __Template__: [topicList.json](https://github.com/hrdk108/hsbot/blob/master/db/data/topicList.json) and [topics.json](https://github.com/hrdk108/hsbot/blob/master/db/data/topics.json)

## Example

```
var topicList = require('../db/data/topicList.json'); // Your file path as per defined template.
var topics = require('../db/data/topics.json'); // Your file path as per defined template.
const HSBot = require('hsbot');
const hsBot = new HSBot(topicList, topics);
var userId = "aQ11zyTr4u7I";
var userName;
 
// userId (Mandatory)
// userName (User Name)
// human_text (Your answer/query, the question asked by HSBot)


hsBot.transformAndReply(userId, userName, human_text, function(err, data){
  console.log("HSBot:", data);
});

```

## Analysis
There are multiples APIs are available to analyze user's activities.
Please visit [HSBOT document](https://hrdk108.github.io/hsbot/).

## Thank you!