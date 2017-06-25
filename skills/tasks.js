/*

Botkit Studio Skill module to enhance the "tasks" script

*/
const Botkit = require('botkit')
const request = require('request')
const moment = require('moment')
const entries = require('object.entries');
const R = require('ramda')
const app = require('../app/tasks')

module.exports = function(controller) {
    // define a before hook
    // you may define multiple before hooks. they will run in the order they are defined.
    // See: https://github.com/howdyai/botkit/blob/master/docs/readme-studio.md#controllerstudiobefore
    controller.studio.before('tasks', function(convo, next) {
      var bot = controller.spawn({token: process.env.slackApiToken});
      bot.api.channels.history({
        channel: 'C09PT6L3V',
        oldest: moment().hours(0).minutes(0).seconds(0).format('X'),
      }, function(err, res) {
        const taskTimes = app.aggregate(res.messages)
        convo.setVar('taskTimes', taskTimes)
        next()
      })
    });
}
