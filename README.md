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

For example, if you're using [botki]() with Slack and you want Wit.ai to process messages for all direct messages
and direct mentions:

    controller.hears('.*', 'direct_message,direct_mention', function (bot, message) {
      witbot.process(message.text, bot, message)
    })

### Register Intent handlers

Use `hears` to receive a message that matches an intent for messages you process:

    witbot.hears(intent_name, confidence, callback)

- `intent_name` is the name of a Wit intent
- `confidence` is the minimum confidence (e.g. 0.6) between 0 and 1
- `callback` is a function to fire when the intent is matched. Callback will be passed the parameters you registered
  with `process` and then an `outcome parameter`

    witbot.hears('greeting', 0.5, function (bot, message, outcome) {
      bot.reply(message, 'Hello to you as well!')
    })

`outcome` has the following properties

- `_text` is the original text passed to wit
-  `confidence` is a number between 0 and 1
- `intent` is the first intent that was matched
- `entities` see the Wit API to learn more about matched entities

For example, if you call process with `foo` and `bar`:

    witbot.process(text, foo, bar)

Then register intent handlers that expect those parameters in the callback:

    witbot.hears(hello, 0.5, function (foo, bar, outcome) {
      // use foo, bar and outcome
    })
