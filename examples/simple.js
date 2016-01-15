var Botkit = require('botkit')
var Witbot = require('../')

var slackToken = process.env.SLACK_TOKEN
var witToken = process.env.WIT_TOKEN

var controller = Botkit.slackbot({
  debug: false
})

controller.spawn({
  token: slackToken
}).startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error('Error connecting to Slack: ', err)
  }
  console.log('Connected to Slack')
})

var witbot = Witbot(witToken)

// wire up DMs and direct mentions to wit.ai
controller.hears('.*', 'direct_message,direct_mention', function (bot, message) {
  witbot.process(message.text, bot, message)
})

witbot.hears('greeting', 0.5, function (bot, message, outcome) {
  bot.reply(message, 'Hello to you as well!')
})

witbot.hears('how_are_you', 0.5, function (bot, message, outcome) {
  bot.reply(message, 'I\'m great my friend!')
})

witbot.otherwise(function (bot, message) {
  console.log(bot, message)
  bot.reply(message, 'You are so intelligent, and I am so simple. I don\'t understnd')
})
