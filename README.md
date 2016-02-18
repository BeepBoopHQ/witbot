# Witbot - a simple Wit interface for bots

[Wit.ai](https://wit.ai) is a really approachable API for adding Natural Language Processing (NLP) capabilities to bots.
It works great for Slackbots that run on [Beep Boop](https://beepboophq.com) 👍

## Install

`npm install --save witbot`

## Usage

### Initialize

    var Witbot = require('witbot')
    var witbot = Witbot(witToken)

### Wire up

Witbot doesn't assume any bot framework or even Slack but you have to wire up message events or whatever text will
trigger calls to Wit.ai. The first parameter to `process` is the text for Wit to consider. The remaining arguments will
be passed to the handlers your register for each Wit intent.

witbot.process(text, any, additional, arguments)

For example, if you're using [botkit](https://github.com/howdyai/botkit) with Slack and you want Wit.ai to process messages for all direct messages
and direct mentions:

    controller.hears('.*', 'direct_message,direct_mention', function (bot, message) {
      var wit = witbot.process(message.text, bot, message)
    })

### Register Intent handlers
Use `hears` to receive a message that matches an intent for messages you process:

    wit.hears(intent_name, confidence, callback)

`hears` expects these parameters:

- `intent_name` is the name of a Wit intent
- `confidence` is the minimum confidence (e.g. 0.6) between 0 and 1
- `callback` is a function to fire when the intent is matched. Callback will be passed the parameters you registered
  with `process` and then an `outcome parameter`

    wit.hears('greeting', 0.5, function (bot, message, outcome) {
      bot.reply(message, 'Hello to you as well!')
    })

`outcome` has the following properties:

- `_text` is the original text passed to wit
- `confidence` is a number between 0 and 1
- `intent` is the first intent that was matched
- `entities` see the Wit API to learn more about matched entities

For example, if you call process with `foo` and `bar`:

    var wit = witbot.process(text, foo, bar)

Then register intent handlers that expect those parameters in the callback:

    wit.hears(hello, 0.5, function (foo, bar, outcome) {
      // use foo, bar and outcome
    })

### Match any intent with `any`

   wit.any(function (foo, bar, outcome) {
       // access intent through outcome.intent
   })

### Catch-All with `otherwise`
If you're processing incoming messages with witbot and want to provide a catch-all for unmatched intents and/or
no intents, use `witbot.otherwise` like this:

    wit.otherwise(function (foo, bar) {
      // use foo, bar and outcome
    })

Your `otherwise` callback will pass along the same parameters you registered with `process`

### Chaining
You can chain all of the witbot calls for convenience. For example you could do

    witbot.process(response.text)
      .hears('good', 0.5, function (outcome) {
        convo.say('I am so glad to hear it!')
        convo.next()
      })
      .hears('bad', 0.5, function (outcome) {
        convo.say('I\'m sorry, that is terrible')
        convo.next()
      })
      .otherwise(function (outcome) {
        convo.say('I\'m cofused')
        convo.repeat()
        convo.next()
      })


## Example
Here's a full example using botkit including a nested conversation flow and [this sample wit.ai project](https://wit.ai/mbrevoort/witbot-sample)

    var Botkit = require('botkit')
    var Witbot = require('../')

    var slackToken = process.env.SLACK_TOKEN
    var witbot = Witbot(process.env.WIT_TOKEN)
    var controller = Botkit.slackbot({ debug: false })

    controller.spawn({ token: slackToken }).startRTM(function (err, bot, payload) {
      if (err) throw new Error('Error connecting to Slack: ', err)
      console.log('Connected to Slack')
    })

    // wire up DMs and direct mentions to wit.ai
    controller.hears('.*', 'direct_message,direct_mention', function (bot, message) {
      var wit = witbot.process(message.text, bot, message)

      wit.hears('hello', 0.53, function (bot, message, outcome) {
        bot.startConversation(message, function (_, convo) {
          convo.say('Hello!')
          convo.ask('How are you?', function (response, convo) {
            witbot.process(response.text)
              .hears('good', 0.5, function (outcome) {
                convo.say('I am so glad to hear it!')
                convo.next()
              })
              .hears('bad', 0.5, function (outcome) {
                convo.say('I\'m sorry, that is terrible')
                convo.next()
              })
              .otherwise(function (outcome) {
                convo.say('I\'m cofused')
                convo.repeat()
                convo.next()
              })
          })
        })
      })

      wit.otherwise(function (bot, message) {
        bot.reply(message, 'You are so intelligent, and I am so simple. I don\'t understnd')
      })
    })



Don't forget to install this module and botkit:

    npm install --save botkit witbot
